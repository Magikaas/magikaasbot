const BoardState = require("./BoardState");
const DBObject = require("./DB/DBObject");

class Board extends DBObject {
    constructor() {
        super();
        this._currentBoardstate = {};
    }

    /**
     * 
     * @param {BoardState} boardState 
     * @returns 
     */
    setBoardState(boardState) {
        this._boardstate[this.hash(boardState._data)] = boardState;
        return this;
    }

    /**
     * 
     * @returns {BoardState}
     */
    getBoardState() {
        return BoardState.load(this._currentBoardstate);
    }
}

module.exports = Board;