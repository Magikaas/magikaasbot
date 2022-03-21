const { DBBoardstate } = require("../../../mysql/tables");
const DBObject = require("./DB/DBObject");

class Boardstate extends DBObject {
    static _dbObjectBase = DBBoardstate;
    constructor() {
        super();
        this._data = {};
        this._weightedMoves = {};
    }

    setAvailableMoves(weightedMoves) {
        this._weightedMoves = weightedMoves;
        return this;
    }

    getAvailableMoves() {
        return this._weightedMoves;
    }

    setMoveWeights(moveWeights) {
        this._data.moveWeights = moveWeights;
        return this;
    }

    getMoveWeights() {
        return this._data.moveWeights;
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
        const output = await this._dbObjectBase.findOne({
            attributes: ['id', 'hash', 'data', 'gametypeId'],
            where: {
                id: id
            }
        });

        if (!output) {
            return null;
        }
        
        return output;
    }

    async save() {
        console.log("Saving boardstate with id", this._dbObject.id);

        this._dbObject.hash = this.hash(this._dbObject.data);
        this._dbObject.data = JSON.stringify(this._dbObject.data);

        super.save();

        console.log("Saved boardstate with hash", this._dbObject.hash, "with id", this.getId());
    }
}

module.exports = Boardstate;