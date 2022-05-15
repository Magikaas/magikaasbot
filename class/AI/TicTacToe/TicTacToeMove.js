const Move = require("../Generic/Move");

class TicTacToeMove extends Move {
    constructor() {
        super();
        
        this._objectType = "TicTacToeMove";
    }

    setSide(side) {
        this._data.side = side;
        return this;
    }

    getSide() {
        return this._data.side;
    }

    setSquare(square) {
        this._data.square = square;
        return this;
    }

    getSquare() {
        return this._data.square;
    }
}

module.exports = TicTacToeMove;