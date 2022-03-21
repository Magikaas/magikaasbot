const Boardstate = require("../Generic/Boardstate");

class TicTacToeBoardstate extends Boardstate {
    constructor() {
        super();

        this._squares = {};
    }

    getSquare(x, y) {
        return this.getSquares()[x][y];
    }

    setSquare(square, side) {
        const coords = square.split(',');
        
        this._squares[coords[0]][coords[1]] = side;

        this.determineAvailableMoves();
    }

    getSquares() {
        return this._squares;
    }

    isBoardFull() {
        const squares = this.getSquares();
        for (let x in squares) {
            for (let y in squares[x]) {
                if (!this.isOccupied(x, y)) {
                    return false;
                }
            }
        }
        return true;
    }

    isOccupied(x, y) {
        return this.getSquares()[x][y] !== EMPTY_SQUARE;
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

    /**
     * 
     * @param {Integer} id 
     * @returns {TicTacToeBoardstate}
     */
    static async load(id) {
        let boardstate = await super.load(id);
        
        if (!boardstate) {
            return null;
        }

        console.log("TictactoeBoardstate loaded by id", id, boardstate);

        boardstate.setSquares(boardstate.getDBObject().data.squares);

        return boardstate;
    }

    async save() {
        this._dbObject.hash = this.hash(this.getSquares());
        this._dbObject.data = JSON.stringify({
            squares: this.getSquares()
        });

        super.save();
    }

    consolePrint() {
        const squares = this.getSquares();

        console.log("Board");
        console.log("=============");
        let line = {};
        for (let l in squares) {
            line = squares[l];
            console.log("|", line[0], "|", line[1], "|", line[2], "|");
        }
        console.log("=============");
    }
}

module.exports = TicTacToeBoardstate;