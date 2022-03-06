const { DBGame } = require("../../../mysql/tables");
const Game = require("../Generic/Game");
const GameManager = require("../Generic/GameManager");
const TicTacToeBoardState = require("./TicTacToeBoardState");

class TicTacToeGame extends Game {
    constructor() {
        super();

        this._sides = [
            "X", "O"
        ];

        this.setType("tictactoe");
        const manager = GameManager;

        manager.registerGame(this.getType(), this.constructor.name);
        
        const boardstate = new TicTacToeBoardState();
        this.setBoardstate(boardstate);
    }

    handleMove(move) {
        const boardstate = this.getBoardstate();
        
        if (!move.square) {
            console.log("Handling move", move);
            console.log("Unable to handle move, no square set");
            return;
        }

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

    static async load(id) {
        const output = await DBGame.findAll({
            attributes: ['id', 'data'],
            where: {
                id: id
            }
        });

        console.log(output);

        const boardstate = TicTacToeBoardState.load(output.boardstate_id);

        let game = new TicTacToeGame();
        game.setBoardstate(boardstate);

        return game;
    }

    async save() {
        const data = {
            type_id: 
        };
    }
}

module.exports = TicTacToeGame;