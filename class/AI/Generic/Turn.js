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

    changeWeight() {

    }

    static async getAllTurns(gameId) {
        const dbData = await this._dbObjectBase.findAll({
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
                .setBoardstate(await Boardstate.load(data.boardstateId))
                .setMove(await Move.load(data.moveId))
                .setGame(await Game.load(data.gameId));
            
            turns.push(turn);
        }

        return turns;
    }

    static async load(id) {
        const [dbModel, created] = this._dbObjectBase.findOrBuild({
            attributes: ['id', 'sequence', 'moveId', 'boardstateId', 'gameId'],
            where: {
                id: id
            }
        });

        if (created) {
            return null;
        }

        let turn = this.create();
        turn._dbObject = dbModel;

        return turn;
    }

    async save() {
        // console.trace("Saving game", this);
        this._dbObject.moveId = this._move.getId();
        this._dbObject.boardstateId = this._boardstate.getId();
        this._dbObject.gameId = this._game.getId();
        
        await super.save();
    }
}

module.exports = Turn;