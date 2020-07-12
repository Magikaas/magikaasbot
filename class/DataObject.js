class DataObject {
    constructor() {
        this._data = {};
    }

    set(prop, value) {
        this._data[prop] = value;
    }

    get(prop) {
        return this._data[prop];
    }

    getData() {
        return this._data;
    }

    save() {
        // Does nothing in base class, 
    }

    load() {
        // Does nothing in base class.
    }
}

module.exports = {
    DataObject
}