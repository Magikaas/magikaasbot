const { DBPlayer } = require("../../../mysql/tables");
const ClassRepository = require("../ClassRepository");
const DBObject = require("./DB/DBObject");

class Player extends DBObject {
    static _dbObjectBase = DBPlayer;
    constructor() {
        super();
        this._game = null;
        this._side = null;
        this._data = {};
    }

    setGame(game) {
        this._game = game;
        return this;
    }

    /**
     * 
     * @returns {Game}
     */
    getGame() {
        return this._game;
    }

    setSide(side) {
        this._side = side;
        return this;
    }

    getSide() {
        return this._side;
    }

    setData(data) {
        this._data = data;
        return this;
    }

    getData() {
        return this._data;
    }

    /**
     * Load this AI's data from the database
     * 
     * @param {any} id 
     * @returns {Player}
     */
    static async load(id) {
        const [dbModel, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'data'],
            where: {'id': id}
        });

        let player = {};

        if (!created) {
            player = this.create();
            player._dbObject = dbModel;
    
            player.setId(id);
            player.setData(dbModel.data);
        }
        else {
            return null;
        }
        
        return player;
    }
}

module.exports = Player;