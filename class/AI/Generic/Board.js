const Boardstate = require("./Boardstate");
const DBObject = require("./DB/DBObject");

class Board extends DBObject {
    constructor() {
        super();
        this._currentBoardstate = {};
        this._objectType = "generic";
    }

    /**
     * 
     * @param {Boardstate} boardstate 
     * @returns 
     */
    setBoardState(boardstate) {
        this._boardstate[this.hash(boardstate._data)] = boardstate;
        return this;
    }

    /**
     * 
     * @returns {Boardstate}
     */
    getBoardState() {
        return Boardstate.load(this._currentBoardstate);
    }
}

module.exports = Board;