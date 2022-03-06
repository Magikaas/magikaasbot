const General = require("../../../General");

class DBObject extends General {
    constructor() {
        super();
        this._id = null;
        this._data = {};
    }

    setId(id) {
        this._id = id;
        return this;
    }

    getId() {
        return this._id;
    }

    save() {
        throw new Error("Implement this function in " + this.constructor.name + ". Unable to save.");
    }
}

module.exports = DBObject;