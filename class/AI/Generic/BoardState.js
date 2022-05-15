const { DBBoardstate } = require("../../../mysql/tables");
const DBObject = require("./DB/DBObject");

class Boardstate extends DBObject {
    static _dbObjectBase = DBBoardstate;
    constructor() {
        super();
        this._data = {};
        this._weightedMoves = {};
        this._objectType = "generic";
    }

    setAvailableMoves(weightedMoves) {
        this._weightedMoves = weightedMoves;
        return this;
    }

    getAvailableMoves() {
        return this._weightedMoves;
    }

    initiate() {
        throw new Error("Implement this function in " + this.constructor.name + ". Can't initiate generic boardstate");
    }

    /**
     * 
     * @param {Integer} id 
     * @returns {Boardstate}
     */
    static async load(id) {
        const [dbModel, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'hash', 'data', 'gametypeId'],
            where: {
                id: id
            }
        });

        if (created) {
            return null;
        }

        // We run create to make sure the correct instance is generated
        const boardstate = this.build();
        boardstate._dbObject = dbModel;

        boardstate.setId(id);
        
        return boardstate;
    }

    async save() {
        await super.save();
    }
}

module.exports = Boardstate;