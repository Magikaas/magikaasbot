const { DBGameType, DBPlayer, DBGame } = require("../../../mysql/tables");
const BoardState = require("./Boardstate");
const DBObject = require("./DB/DBObject");
const GameType = require("./GameType");
const Player = require("./Player");

class Game extends DBObject {
    constructor() {
        super();
        this._players = {};
        this._type = "generic";
        this._boardstate = {};
        this._boardstateClass = "";
        this._currentTurnPlayer = {};
    }

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this._players[player.getId()] = player;
        
        const playerData = {
            gameId: this.getId(),
            data: "",
            id: player.getId()
        };

        // Only add player if it's not already in this game
        DBPlayer.findOne({
            attributes: ["id", "data", "gameid"],
            where: playerData
        }).then((result) => {
            if (!result || result.length == 0) {
                DBPlayer.create(playerData);
            }
        }).catch((err) => {
            console.log("Failed to find gameplayer", err);
        });
        
        return this;
    }

    setPlayerSide(player, side) {
        this._players[player.getId()].side = side;
    }

    getPlayerSide(player) {
        return this._players[player.getId()].side;
    }

    /**
     * 
     * @param {Player} player 
     * @returns 
     */
    removePlayer(player) {
        if (this._players[player.getId()]) {
            this._players[player.getId()] = null;
        }
        return this;
    }

    /**
     * 
     * @param Integer id 
     * @returns {Player}
     */
    getPlayer(id) {
        return this._players[id];
    }

    getPlayers() {
        return this._players;
    }

    /**
     * 
     * @param {String} type 
     * @returns {Object}
     */
    setType(type) {
        this._type = type;
        return this;
    }

    /**
     * 
     * @returns {String}
     */
    getType() {
        return this._type;
    }

    /**
     * Set this game's board data
     * 
     * @param {Boardstate} boardstate 
     * @returns {Game}
     */
    setBoardstate(boardstate) {
        this._boardstate = boardstate;
        return this;
    }

    /**
     * Fetch this game's board
     * 
     * @returns {Boardstate}
     */
    getBoardstate() {
        return this._boardstate;
    }

    initiateBoardstate() {
        const boardstate = this.getRepo().fetchClass(this.getBoardstateClass());

        if (!boardstate) {
            console.log("Boardstateclass", boardstate, this.getBoardstateClass());
            return null;
        }

        boardstate.initiate();

        return boardstate;
    }

    async loadDefaultBoardstate() {
        const gameType = await GameType.getByName(this.getType());

        const defaultBoardstateId = gameType.getDefaultBoardstateId();

        let boardstate = {};

        if (defaultBoardstateId === 0) {
            boardstate = this.initiateBoardstate();
        }
        else {
            boardstate = await BoardState.load(defaultBoardstateId);
        }

        return boardstate;
    }

    setBoardstateClass(boardstateClass) {
        this._boardstateClass = boardstateClass;
        return this;
    }

    getBoardstateClass() {
        return this._boardstateClass;
    }

    getCurrentTurnPlayer() {
        return this._currentTurnPlayer;
    }

    setPlayerTurn(player) {
        this._currentTurnPlayer = player;
        return this;
    }

    getClass() {
        return this.class
    }

    getRandomPlayer() {
        const players = this._players;

        let count = 0;
        for (let p in players) {
            count++;
        }

        const random = Math.floor(Math.random() * count);

        let c = 0;
        for (let p in players) {
            if (c == random) {
                return players[p];
            }
            c++;
        }

        return null;
    }

    startGame() {
        const player = this.getRandomPlayer();
        this._currentTurnPlayer = player;
    }

    checkIfWon() {
        throw new Error("Implement this function(" + arguments.callee.name + ") in " + this.constructor.name + ".");
    }

    getWinner() {
        throw new Error("Implement this function(" + arguments.callee.name + ") in " + this.constructor.name + ".");
    }

    static getGameType(id) {
        try {
            return DBGameType.findOne({
                attribute: ['type_id'],
                where: {
                    id: id
                }
            });
        }
        catch (error) {
            console.log("Error", error);

            return null;
        }
    }

    static async load(id) {
        const output = await DBGame.findOne({
            attributes: ['id', 'data'],
            where: {
                id: id
            }
        });

        const boardstateClass = this.getRepo().fetchClass(this.getBoardstateClass());

        console.log("LOAD: Board state class", boardstateClass, this.getBoardstateClass());

        const boardstate = boardstateClass.load(output.boardstate_id);

        let game = new $(this.constructor.name)();
        game.setBoardstate(boardstate);

        return game;
    }

    static load(id) {
        throw new Error("Implement this function in " + this.constructor.name + ". Unable to load Boardstate with ID " + id);
    }

    static create(gameTypeId) {
        const gameType = GameType.load(gameTypeId);

        const game = new Game();

        game.setType(gameType.getId());
        game.setBoardstateClass(gameType.getBoardstateClass());

        game.save();

        return game;
    }

    async save() {
        super.save();
    }
}

module.exports = Game;