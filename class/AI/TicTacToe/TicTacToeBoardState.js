const Boardstate = require("../Generic/Boardstate");

class TicTacToeBoardstate extends Boardstate {
    constructor() {
        super();

        this._squares = {};
        this._sides = {};
        
        this._objectType = "TicTacToeBoardstate";
    }

    setSquare(square, side) {
        const coords = square.split(',');
        
        this._squares[coords[0]][coords[1]] = side;

        this.determineAvailableMoves();
    }

    getSquare(x, y) {
        return this.getSquares()[x][y];
    }

    setSquares(squares) {
        this._squares = squares;
        return this;
    }

    getSquares() {
        return this._squares;
    }

    setSides(sides) {
        this._sides = sides;
        return this;
    }

    getSides() {
        return this._sides;
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
                    let sideMoves = {};
                    for (let side of Object.values(this.getSides())) {
                        sideMoves[side] = 5;
                    }
                    moves[x + ',' + y] = sideMoves;
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

    async exists() {
        const dbData = await Boardstate._dbObjectBase.findOne({
            attributes: ['id', 'hash', 'data', 'gametypeId'],
            where: {
                hash: this.getHash()
            }
        });

        if (dbData !== null && !this._id) {
            this.setId(dbData.id);
        }

        return !!dbData;
    }

    getHash() {
        return this.hash(this.getSquares());
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

        boardstate.setSquares(JSON.parse(boardstate.getDBObject().data).squares);
        boardstate.setAvailableMoves(JSON.parse(boardstate.getDBObject().data).moves);

        return boardstate;
    }

    async save() {
        this._dbObject.hash = this.hash(this.getSquares());
        this._dbObject.data = JSON.stringify({
            squares: this.getSquares(),
            moves: this.getAvailableMoves()
        });

        const alreadyExists = await this.exists();

        if (!alreadyExists) {
            // Clone data, create new record by removing id
            let dataValues = JSON.parse(JSON.stringify(this._dbObject.dataValues));
            delete dataValues.id;
            this._dbObject = this.constructor._dbObjectBase.build(dataValues);

            this.consolePrint();

            await super.save();
        } else {
            // Do not save this existing object
            this._dbObject.isNewRecord = false;
            await super.save();
        }
    }

    consolePrint() {
        const squares = this.getSquares();

        // console.log("Board");
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