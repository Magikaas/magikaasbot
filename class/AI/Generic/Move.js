const DBObject = require("./DB/DBObject");

class Move extends DBObject {
    constructor() {
        super();
        this._data = {};
    }

    setData(data) {
        this._data = data;
        return this;
    }

    getData() {
        return this._data;
    }
}

module.exports = Move;