const { DBGame, DBGameType } = require("../../../mysql/tables");
const BoardState = require("./BoardState");
const DBObject = require("./DB/DBObject");
const Player = require("./Player");

class Game extends DBObject {
    constructor() {
        super();
        this._players = {};
        this._type = "generic";
        this._boardstate = {};
        this._currentTurnPlayer = {};
    }

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this._players[player.getId()] = player;
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
     * @param {BoardState} boardstate 
     * @returns {Game}
     */
    setBoardstate(boardstate) {
        this._boardstate = boardstate;
        return this;
    }

    /**
     * Fetch this game's board
     * 
     * @returns {BoardState}
     */
    getBoardstate() {
        return this._boardstate;
    }

    getCurrentTurnPlayer() {
        return this._currentTurnPlayer;
    }

    setPlayerTurn(player) {
        this._currentTurnPlayer = player;
        return this;
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

    static getGameType(id) {
        try {
            const output = await DBGameType.findAll({
                attribute: ['type_id'],
                where: {
                    id: id
                }
            });
    
            console.log("Game DB", id, output, output.type_id);
    
            return output.type_id;
        }
        catch (error) {
            console.log("Error", error);

            return null;
        }
    }

    static load(id) {
        throw new Error("Implement this function in " + this.constructor.name + ". Unable to load Boardstate with ID " + id);
    }

    save() {
        super.save();
    }
}

module.exports = Game;