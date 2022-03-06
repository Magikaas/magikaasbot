const Board = require("../Generic/Board");

EMPTY_SQUARE = " ";
X = "X";
O = "O";

class TicTacToeBoard extends Board {
    constructor() {
        super();
    }

    doMove(move, side) {
        this.getBoardState().setSquare(move.square, side);
    }
}

module.exports = TicTacToeBoard;