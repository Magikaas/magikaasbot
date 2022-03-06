class BoardState {
    constructor() {
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

    static load(id) {
        throw new Error("Implement this function in " + this.constructor.name + ". Unable to load Boardstate with ID " + id);
    }
}

module.exports = BoardState;