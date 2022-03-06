const DBObject = require("./DB/DBObject");

class Player extends DBObject {
    constructor() {
        super();
        this._gameId = null;
        this._side = null;
    }

    setGame(gameId) {
        this._gameId = gameId;
        return this;
    }

    getGameId() {
        return this._gameId;
    }

    setSide(side) {
        this._side = side;
        return this;
    }

    getSide() {
        return this._side;
    }
}

module.exports = Player;