const Turn = require("../Generic/Turn");

class TicTacToeTurn extends Turn {
    constructor() {
        super();

        this._objectType = "TicTacToeTurn";
    }

    async adjustWeight() {
        const Game = require("./../Generic/Game");
        const move = this.getMove();
        const game = await Game.load(move.getData().game);

        const winner = game.getWinner();

        const TicTacToeBoardstate = require("./TicTacToeBoardState");

        const boardstate = await TicTacToeBoardstate.load(this.getBoardstate().getId());

        let moves = boardstate.getAvailableMoves();

        const moveData = move.getData();

        // console.log("Moves", moves, "Square", moveData.square, "Winner", winner, "Side", moveData.side);

        if (winner === false) {
            moves[moveData.square][moveData.side]--;
        }
        else {
            try {
                if (!moves[moveData.square]) {
                    console.log("Impossible move for boardstate detected", moveData, boardstate);
                }
                else {
                    if (winner === moveData.side) {
                        moves[moveData.square][winner] += 2;
                    }
                    else {
                        moves[moveData.square][winner] -= 2;
                    }
                }
            }
            catch (err) {
                // console.log("ID", this.getId());
                // console.log(err);
                // console.log("Movedata", moveData, winner);
                // console.log(moves);
            }
        }

        // console.log("Moves", moves);

        // console.log("Moves", moves, "Updated", modeData.square, "to", moves[moveData.square][winner]);

        boardstate.setAvailableMoves(moves);

        await boardstate.save();
    }

    validate() {
        const boardstate = this.getBoardstate();
        const move = this.getMove();

        const moves = boardstate.getAvailableMoves();

        if (!moves[move.getSquare()]) {
            console.log("Invalid turn", this.getId(), "Move", move.getId(), move.getSquare(), moves);
        }
    }

    static async load(id) {
        let turn = await super.load(id);

        const TicTacToeBoardstate = require("./TicTacToeBoardState");
        const TicTacToeGame = require("./TicTacToeGame");
        const TicTacToeMove = require("./TicTacToeMove");
        
        turn.setBoardstate(await TicTacToeBoardstate.load(data.boardstateId));
        turn.setGame(await TicTacToeGame.load(data.gameId));
        turn.setMove(await TicTacToeMove.load(data.moveId));

        turn._dbObject.moveId = turn._move.getId();
        turn._dbObject.boardstateId = turn._boardstate.getId();
        turn._dbObject.gameId = turn._game.getId();

        return turn;
    }

    static async loadByProps(props) {
        if (!props) {
            const turns = await this._dbObjectBase.findAll();
        }
        else {
            const turns = await this._dbObjectBase.find({
                where: props
            });
        }

        let result = [];

        for (let turn of turns) {
            let turnObject = await this.load(turn.id);

            result.push(turnObject);
        }

        return result;
    }

    static async loadAll() {
        return this.loadByProps();
    }

    static async loadByGame(gameId) {
        return this.loadByProps({ gameId: gameId });
    }
}

module.exports = TicTacToeTurn;