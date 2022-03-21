const { DBTurn } = require("../../../mysql/tables");
const Boardstate = require("./Boardstate");
const DBObject = require("./DB/DBObject");
const Game = require("./Game");
const Move = require("./Move");

class Turn extends DBObject {
    static _dbObjectBase = DBTurn;
    constructor() {
        super();
        this._sequence = 0;
        this._move = {};
        this._boardstate = {};
        this._game = {};
    }

    setSequence(sequence) {
        this._sequence = sequence;
        return this;
    }

    getSequence() {
        return this._sequence;
    }

    setMove(move) {
        this._move = move;
        return this;
    }

    getMove() {
        return this._move;
    }

    setBoardstate(boardstate) {
        this._boardstate = boardstate;
        return this;
    }

    getBoardstate() {
        return this._boardstate;
    }

    setGame(game) {
        this._game = game;
        return this;
    }

    getGame() {
        return this._game;
    }

    static async getAllTurns(gameId) {
        const dbData = this._dbObjectBase.findAll({
            attributes: ['id', 'sequence', 'moveId', 'boardstateId', 'gameId'],
            where: {
                gameId: gameId
            }
        });

        let turns = [];
        let turn = {};

        for (let data of dbData) {
            turn = Turn.create();

            turn.setSequence(data.sequence)
                .setBoardstate(Boardstate.load(data.boardstateId))
                .setMove(Move.load(data.moveId))
                .setGame(Game.load(data.gameId));
            
            turns.push(turn);
        }

        return turns;
    }

    static async load(id) {
        const dbData = this._dbObjectBase.findOne({
            attributes: ['id', 'sequence', 'moveId', 'boardstateId', 'gameId'],
            where: {
                id: id
            }
        });

        if (!dbData) {
            return null;
        }

        let turn = this.create();

        return turn;
    }
}

module.exports = Turn;