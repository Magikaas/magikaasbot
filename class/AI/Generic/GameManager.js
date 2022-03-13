const General = require("../../General");
const Game = require("./Game");
const Player = require("./Player");
const ClassRepository = require("../ClassRepository");
const { DBGame, DBPlayer } = require("../../../mysql/tables");

const TICK_RATE = 5;

// Gameloop logic stolen and appropriated from https://github.com/timetocode/node-game-loop/blob/master/gameLoop.js

class GameManager extends General {
    
    constructor() {
        super();

        this._submittedMoves = [];
        this._tickLengthMs = 1000 / TICK_RATE;
        this._prev = Date.now();
        this._actualTicks = 0;
        this._players = {}; // TODO: REPLACE WITH DATABASE INTERACTION
        this._registeredGameclasses = {};
        this._games = {};
        this.startGameLoop();
    }

    /**
     * Register a player with the Manager
     * 
     * @param {Player} player
     */
    registerPlayer(player) {
        this._players[player.getId()] = player;
    }

    getPlayer(id) {
        return this._players[id];
    }

    startGameLoop() {
        this.game();
    }

    game() {
        const now = Date.now();

        this._actualTicks++;
        if (this._prev + this._tickLengthMs <= now) {
            let delta = (now - this._prev) / 1000;
            this._prev = now;

            this.update(delta);

            // console.log('delta', delta, '(target: ' + this._tickLengthMs +' ms)', 'node ticks', this._actualTicks);
            this._actualTicks = 0;
        }

        if (Date.now() - this._prev < this._tickLengthMs - 16) {
            setTimeout(this.game.bind(this));
        } else {
            setImmediate(this.game.bind(this));
        }
    }

    update() {
        const iterator = this.fetchSubmittedMoves();
        let moves = [];
        let move;
        // Check submitted moves
        while(!(move = iterator.next()).done) {
            move = move.value;
            moves.push(move);
        }

        if (moves.length == 0) {
            //No moves to handle, just finish update
            return;
        }

        // Handle submitted moves
        for (let move of moves) {
            this.handleMove(move);
            this.cycleTurn(move);
        }
    }

    getGameTurn(gameId) {
        return this.getGame(gameId).getCurrentTurnPlayer().getId();
    }

    async handleMove(move) {
        const game = await this.getGame(move.game);

        game.handleMove(move);

        this.updateGame(game);
    }

    async cycleTurn(move) {
        let game = await this.getGame(move.game);
        const curTurn = game.getCurrentTurnPlayer();

        let keys = Object.keys(game.getPlayers());

        keys = keys.filter(p => p != curTurn.getId());

        const newTurn = game.getPlayers()[keys[Math.floor(keys.length * Math.random())]];

        game.setPlayerTurn(newTurn);
    }

    * fetchSubmittedMoves() {
        let move;
        while (this._submittedMoves.length > 0) {
            move = this._submittedMoves.shift();
            yield move;
        }
    }

    submitMove(move) {
        this._submittedMoves.push(move);
    }

    hrtimeMs() {
        let time = process.hrtime();
        return time[0] * 1000 + time[1] / 1000000;
    }

    /**
     * 
     * @param {any} gameId 
     * @param {Player} player 
     * @returns {Boolean}
     */
    async checkIsTurn(gameId, player) {
        const game = await this.getGame(gameId);

        const currentTurn = game.getCurrentTurnPlayer();

        return currentTurn.getId() == player.getId();
    }

    registerGame(gameName, classObject) {
        this._registeredGameclasses[gameName] = classObject;
        return this;
    }

    getGameClass(gameName) {
        return this._registeredGameclasses[gameName];
    }

    /**
     * Initiate a new game of the type provided.
     * 
     * @param {String} gameName 
     * @returns 
     */
    async initiateGame(gameName) {
        const gameClassName = this.getGameClass(gameName);

        const repo = ClassRepository;
        const game = repo.fetchClass(gameClassName);

        console.log("Initiated game");

        const boardstate = await game.loadDefaultBoardstate();
        
        game.setBoardstate(boardstate);
        
        await game.save();

        console.log("Game saved");

        this.addGame(game);

        return game;
    }

    /**
     * Start the game's simulation
     * 
     * @param {Game} game 
     */
    startGame(game) {
        game.startGame();
    }

    /**
     * 
     * @param {any} gameId 
     * @returns {Game}
     */
    async getGame(gameId, force = false) {
        if (this._games[gameId]) {
            return this._games[gameId];
        }

        const data = await DBGame.findOne({
            attributes: ["id"],
            where: {
                id: gameId
            },
            include: DBPlayer
        }).catch((err) => {
            console.log("Error when getting game", err);
        });

        console.log("Get game", data);
        return false;
    }

    /**
     * 
     * @param {Game} game 
     */
    addGame(game) {
        this._games[game.getId()] = game;
        return this;
    }

    updateGame(game) {
        this.addGame(game);
    }

    getNewGameId() {
        // Currently only based on counts, should be based on database ID
        let c = 1;
        for (let g in this._games) {
            c++;
        }

        return c;
    }

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     */
    addPlayerToGame(game, player) {
        if (typeof game != 'object') {
            game = this.getGame(game.getId());
        }

        if (!game) {
            throw new Error('No game found for ID ' + gameId);
        }

        this.registerPlayer(player);

        player.setGame(game.getId());
        game.addPlayer(player);

        this.updateGame(game);

        return this;
    }

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     */
    removePlayerFromGame(game, player) {
        game.removePlayer(player);
        return this;
    }
}

module.exports = new GameManager();