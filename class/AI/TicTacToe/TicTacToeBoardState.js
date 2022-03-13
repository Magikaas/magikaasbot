const Boardstate = require("../Generic/Boardstate");

class TicTacToeBoardstate extends Boardstate {
    constructor() {
        super();

        this._squares = {};
    }

    setSquare(square, side) {
        const coords = square.split(',');
        
        this._squares[coords[0]][coords[1]] = side;

        this.determineAvailableMoves();
    }

    getSquares() {
        return this._squares;
    }

    determineAvailableMoves() {
        let moves = {};

        const squares = this._squares;

        for (let x = 0; x < Object.keys(squares).length; x++) {
            for (let y = 0; y < Object.keys(squares[x]).length; y++) {
                if (squares[x][y] == EMPTY_SQUARE) {
                    moves[x + ',' + y] = 5;
                }
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

    initiate() {
        this.prepareSquares();
        this.determineAvailableMoves();
    }

    static async load(id) {
        
    }
}

module.exports = TicTacToeBoardstate;