const { DBGame, DBGameType } = require("../../../mysql/tables");
const Game = require("../Generic/Game");
const GameManager = require("../Generic/GameManager");
const GameType = require("../Generic/GameType");
const TicTacToeBoardstate = require("./TicTacToeBoardstate");

class TicTacToeGame extends Game {
    constructor() {
        super();
        this._sides = [
            "X", "O"
        ];

        this.setType("tictactoe");
        this.setBoardstateClass("TicTacToeBoardstate");
        const manager = GameManager;

        manager.registerGame(this.getType(), this.constructor.name);
    }

    handleMove(move) {
        const boardstate = this.getBoardstate();
        
        if (!move.square) {
            // console.log("Handling move", move);
            console.trace("Unable to handle move, no square set");
            return;
        }

        console.log("Square", move.square, "Move", this.getPlayerSide(move.player));

        boardstate.setSquare(move.square, this.getPlayerSide(move.player));

        this.setBoardstate(boardstate);
    }

    addPlayer(player) {
        if (Object.keys(this._players).length > this._sides.length) {
            console.error("Unable to add new player, max players reached");
            return false;
        }
        super.addPlayer(player);

        // Pick the first side you can
        this.setPlayerSide(player, this._sides[Object.keys(this._players).length - 1]);
    }

    startGame() {
        super.startGame();
    }

    checkIfWon() {
        if (this.isBoardFull()) {
            this.setWinner(false);
            this.resetBoard();
        }
        for (let i of [0,1,2]) {
            //Horizontal
            if (this.isOccupied(i,0) && this.getBoardstate().getSquare(i,0) == this.getBoardstate().getSquare(i,1) && this.getBoardstate().getSquare(i,0) == this.getBoardstate().getSquare(i,2)) {
                console.log(this.getBoardstate().getSquare(i,0) + " has won!");
                this.setWinner(this.getBoardstate().getSquare(i,0));
                this.resetBoard();
            }

            //Vertical
            if (this.isOccupied(0,i) && this.getBoardstate().getSquare(0,i) == this.getBoardstate().getSquare(1,i) && this.getBoardstate().getSquare(0,i) == this.getBoardstate().getSquare(2,i)) {
                console.log(this.getBoardstate().getSquare(0,i) + " has won!");
                this.setWinner(this.getBoardstate().getSquare(0,i));
                this.resetBoard();
            }
        }
        //Diagonal to bottomright
        if ((this.isOccupied(0,0) && this.getBoardstate().getSquare(0,0) == this.getBoardstate().getSquare(1,1) && this.getBoardstate().getSquare(0,0) == this.getBoardstate().getSquare(2,2))) {
            console.log(this.getBoardstate().getSquare(0,0) + " has won!");
            this.setWinner(this.getBoardstate().getSquare(0,0));
            this.resetBoard();
        }

        
        //Diagonal to topright
        if (this.isOccupied(0,2) && this.getBoardstate().getSquare(0,2) == this.getBoardstate().getSquare(1,1) && this.getBoardstate().getSquare(0,2) == this.getBoardstate().getSquare(2,0)) {
            console.log(this.getBoardstate().getSquare(0,2) + " has won!");
            this.setWinner(this.getBoardstate().getSquare(0,2));
            this.resetBoard();
        }
    }

    isOccupied(x, y) {
        return this.getBoard()[x][y] !== EMPTY_SQUARE;
    }

    getWinner() {
        throw new Error("Implement this function(" + arguments.callee.name + ") in " + this.constructor.name + ".");
    }

    static async load(id) {
        const output = await DBGame.findOne({
            attributes: ['id', 'data'],
            where: {
                id: id
            }
        });

        const boardstate = TicTacToeBoardstate.load(output.boardstate_id);

        let game = new TicTacToeGame();
        game.setBoardstate(boardstate);

        return game;
    }

    async save() {
        const gameType = await GameType.getByName(this.getType());

        const data = {
            typeid:         gameType.getId(),
            boardstateid:   this.getBoardstate().getId()
        };

        let gameObject = {};

        gameObject = await DBGame.create(data);
        
        this.setId(gameObject.id);
    }
}

module.exports = TicTacToeGame;