const BoardState = require("../Generic/BoardState");

class TicTacToeBoardState extends BoardState {
    constructor() {
        super();

        this._squares = {};

        this.prepareSquares();
        this.determineAvailableMoves();
    }

    setSquare(square, side) {
        const coords = square.split(',');
        
        this._squares[coords[0]][coords[1]] = side;
    }

    determineAvailableMoves() {
        let moves = {};

        const squares = this._squares;

        for (let x = 0; x < Object.keys(squares).length; x++) {
            for (let y = 0; y < Object.keys(squares[x]).length; y++) {
                moves[x + ',' + y] = 5;
            }
        }

        this.setAvailableMoves(moves);
    }

    prepareSquares() {
        const squares = {};
        
        for (let x = 0; x < 3; x++) {
            squares[x] = {};
            for (let y = 0; y < 3; y++) {
                squares[x][y] = EMPTY_SQUARE;
            }
        }

        this._squares = squares;
    }
}

module.exports = TicTacToeBoardState;