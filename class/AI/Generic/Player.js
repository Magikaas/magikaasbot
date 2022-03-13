const DBObject = require("./DB/DBObject");

class Player extends DBObject {
    constructor() {
        super();
        this._gameId = null;
        this._side = null;
    }

    setGame(gameId) {
        this._gameId = gameId;
        return this;
    }

    getGameId() {
        return this._gameId;
    }

    setSide(side) {
        this._side = side;
        return this;
    }

    getSide() {
        return this._side;
    }

    /**
     * Load this AI's data from the database
     * 
     * @param {any} id 
     * @returns {Obj}
     */
    static async load(id) {
        const data = await Tables.DBPlayer.findOne({
            attributes: ['id', 'data'],
            where: {'id': id},
            include: Tables.DBGame
        });

        console.log("Loading Player", data);
        
        return data;
    }
}

module.exports = Player;