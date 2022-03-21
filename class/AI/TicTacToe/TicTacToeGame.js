const Game = require("../Generic/Game");
const GameManager = require("../Generic/GameManager");

class TicTacToeGame extends Game {
    constructor() {
        super();
        this._sides = [
            "X", "O"
        ];
        this._pickedSides = [];

        this._finished = false;

        this.setType("tictactoe");
        this.setBoardstateClass("TicTacToeBoardstate");
        const manager = GameManager;

        manager.registerGame(this.getType(), this.constructor.name);
    }

    async getPlayerSide(player) {
        const GamePlayer = require("../Generic/GamePlayer");
        const gameplayer = await GamePlayer.loadByData(this, player);

        if (!gameplayer) {
            console.trace("No gameplayer found", gameplayer);
        }

        return gameplayer.getSide();
    }

    async handleMove(move) {
        const boardstate = this.getBoardstate();
        console.log("Handling move", move.square, "game", move.game, "side", move.player.getSide());
        
        if (!move.square) {
            console.trace("Unable to handle move, no square set");
            return;
        }

        // console.log("Square", move.square, "Move", this.getPlayerSide(move.player));

        const side = await this.getPlayerSide(move.player);

        boardstate.setSquare(move.square, side);

        await boardstate.save();

        this.setBoardstate(boardstate);

        this.checkIfWon();

        // this.getBoardstate().consolePrint();
    }

    async addPlayer(player) {
        if (Object.keys(this._players).length > this._sides.length) {
            console.error("Unable to add new player, max players reached");
            return false;
        }
        let gameplayer = await super.addPlayer(player);
        const side = this._sides[Object.keys(this._players).length - 1];

        console.log("Chose side", side, "from", this._sides, "for player", player.getId(), "in", this._players);

        gameplayer.setSide(side);
        player.setSide(side);

        await gameplayer.save();

        // Pick the first side you can
        this._players[player.getId()] = player;

        return player;
    }

    startGame() {
        super.startGame();
    }

    isBoardFull() {
        return this.getBoardstate().isBoardFull();
    }

    checkIfWon() {
        if (this.isBoardFull()) {
            this.setWinner(false);
        }
        for (let i of [0,1,2]) {
            //Horizontal
            if (this.isOccupied(i,0) && this.getBoardstate().getSquare(i,0) == this.getBoardstate().getSquare(i,1) && this.getBoardstate().getSquare(i,0) == this.getBoardstate().getSquare(i,2)) {
                console.log(this.getBoardstate().getSquare(i,0) + " has won!");
                this.setWinner(this.getBoardstate().getSquare(i,0));
            }

            //Vertical
            if (this.isOccupied(0,i) && this.getBoardstate().getSquare(0,i) == this.getBoardstate().getSquare(1,i) && this.getBoardstate().getSquare(0,i) == this.getBoardstate().getSquare(2,i)) {
                console.log(this.getBoardstate().getSquare(0,i) + " has won!");
                this.setWinner(this.getBoardstate().getSquare(0,i));
            }
        }
        //Diagonal to bottomright
        if ((this.isOccupied(0,0) && this.getBoardstate().getSquare(0,0) == this.getBoardstate().getSquare(1,1) && this.getBoardstate().getSquare(0,0) == this.getBoardstate().getSquare(2,2))) {
            console.log(this.getBoardstate().getSquare(0,0) + " has won!");
            this.setWinner(this.getBoardstate().getSquare(0,0));
        }
        
        //Diagonal to topright
        if (this.isOccupied(0,2) && this.getBoardstate().getSquare(0,2) == this.getBoardstate().getSquare(1,1) && this.getBoardstate().getSquare(0,2) == this.getBoardstate().getSquare(2,0)) {
            console.log(this.getBoardstate().getSquare(0,2) + " has won!");
            this.setWinner(this.getBoardstate().getSquare(0,2));
        }
    }

    isOccupied(x, y) {
        return this.getBoardstate().isOccupied(x, y);
    }

    finish() {
        this._finished = true;
    }

    isFinished() {
        return this._finished;
    }
}

module.exports = TicTacToeGame;