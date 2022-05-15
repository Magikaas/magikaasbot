const { DBTurn } = require("../../../mysql/tables");
const DBObject = require("./DB/DBObject");

class Turn extends DBObject {
    static _dbObjectBase = DBTurn;
    constructor() {
        super();
        this._sequence = 0;
        this._move = null;
        this._boardstate = null;
        this._game = null;
        this._objectType = "generic";
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

    static async load(id) {
        const b = this._dbObjectBase;
        const f = b.findOrBuild;
        const [dbModel, created] = f({
            attributes: ['id', 'sequence', 'moveId', 'boardstateId', 'gameId'],
            where: {
                id: id
            }
        });

        if (created) {
            return null;
        }

        let turn = this.build();
        turn._dbObject = dbModel;
        turn.setId(id);

        return turn;
    }

    async save() {
        if (!this._boardstate.getId()) {
            console.trace("Saving without boardstate");
        }
        // console.trace("Saving game", this);
        this._dbObject.moveId = this._move.getId();
        this._dbObject.boardstateId = this._boardstate.getId();
        this._dbObject.gameId = this._game.getId();
        
        await super.save();
    }
}

module.exports = Turn;