const General = require("../../General");
const ClassRepository = require("../ClassRepository");

const TICK_RATE = 5;

// Gameloop logic stolen and appropriated from https://github.com/timetocode/node-game-loop/blob/master/gameLoop.js

class GameManager extends General {
    
    constructor() {
        super();

        this._submittedMoves = [];
        this._tickLengthMs = 1000 / TICK_RATE;
        this._prev = Date.now();
        this._actualTicks = 0;
        this._gameplayers = {}; // TODO: REPLACE WITH DATABASE INTERACTION
        this._registeredGameclasses = {};
        this._games = {};
        this.startGameLoop();
    }

    /**
     * Register a player with the Manager
     * 
     * @param {GamePlayer} gameplayer
     */
    registerPlayer(gameplayer) {
        this._gameplayers[gameplayer.getId()] = gameplayer;
    }

    getPlayer(id) {
        return this._gameplayers[id].getPlayer();
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

        let wonGame = null;

        if (wonGame = this.getFirstUnfinishedWonGame()) {
            
        }

        if (moves.length == 0) {
            //No moves to handle, just finish update
            return;
        }

        // Handle submitted moves
        for (let move of moves) {
            // console.log("Move data", move);
            this.handleMove(move);
            this.cycleTurn(move);
        }
    }

    getFirstUnfinishedWonGame() {
        const games = this.getGames();
        let game = {};

        for (let g of Object.entries(games).filter(([k, g]) => !g.isFinished())) {
            game = g[1];
            game.checkIfWon();

            if (game.hasWinner()) {
                return game;
            }
        }

        return null;
    }

    getGameTurn(gameId) {
        return this.getGame(gameId).getCurrentTurnPlayer().getId();
    }

    async handleMove(move) {
        const game = await this.getGame(move.game);

        await game.handleMove(move);

        game.save();

        this.updateGame(game);
    }

    async cycleTurn(move) {
        let game = await this.getGame(move.game);
        const curTurn = game.getCurrentTurnPlayer();

        if (!curTurn) {
            console.trace("No current turn found", curTurn);
        }

        let keys = Object.keys(game.getPlayers());

        keys = keys.filter(p => p != curTurn.getId());

        const newTurn = game.getPlayers()[keys[Math.floor(keys.length * Math.random())]];

        if (!newTurn) {
            console.log("Players", game.getPlayers(), "Current turn", curTurn, "New Turn", newTurn, "Keys", keys);
        }

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
        return this;
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
    async checkIsTurn(game, player) {
        if (!game) {
            console.trace("Checking turn for non-existent game");
            return false;
        }

        const currentTurn = game.getCurrentTurnPlayer();

        return currentTurn.getId() == player.getId();
    }

    /**
     * 
     * @param {String} gameName 
     * @param {Game} classObject 
     * @returns {GameManager}
     */
    registerGame(gameName, classObject) {
        this._registeredGameclasses[gameName] = classObject;
        return this;
    }

    /**
     * 
     * @param {String} gameName 
     * @returns {Game}
     */
    getGameClass(gameName) {
        return this._registeredGameclasses[gameName];
    }

    /**
     * Initiate a new game of the type provided.
     * 
     * @param {String} gameName
     * @returns {Game}
     */
    async initiateGame(gameName) {
        const gameClassName = this.getGameClass(gameName);

        const repo = ClassRepository;
        const game = await repo.fetchClass(gameClassName).constructor.create();

        const boardstate = await game.loadDefaultBoardstate();
        
        game.setBoardstate(boardstate);
        
        await game.save();

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
     * @returns {Array}
     */
    getGames() {
        return this._games;
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
        
        return null;
    }

    /**
     * 
     * @param {Game} game 
     * @returns {GameManager}
     */
    addGame(game) {
        this._games[game.getId()] = game;
        return this;
    }

    /**
     * 
     * @param {Game} game 
     * @returns {GameManager}
     */
    updateGame(game) {
        this.addGame(game);
        return this;
    }

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     */
    async addPlayerToGame(game, player) {
        if (typeof game != 'object') {
            game = this.getGame(game.getId());
        }

        if (!game) {
            throw new Error('No game found for ID ' + gameId);
        }

        player.setGame(game);
        player = await game.addPlayer(player);

        this.updateGame(game);

        const GamePlayer = require("./GamePlayer");

        let gameplayer = await GamePlayer.loadByData(game, player);

        if (!gameplayer) {
            gameplayer = GamePlayer.create();

            gameplayer.setSide(player.getSide());
        }
        else {
            if (!gameplayer.getSide) {
                console.trace("Gameplayer can't get side", gameplayer);
            }
            player.setSide(gameplayer.getSide());
        }

        if (gameplayer.getId()) {
            this.registerPlayer(gameplayer);
            return this;
        }

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