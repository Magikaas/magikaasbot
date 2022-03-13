const DBObject = require("./DB/DBObject");

class Boardstate extends DBObject {
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

    static async load(id) {
        throw new Error("Implement this function in " + this.constructor.name + ". Unable to load Boardstate with ID " + id);
    }
}

module.exports = Boardstate;