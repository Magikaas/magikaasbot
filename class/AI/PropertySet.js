class PropertySet {
    constructor(props) {
        for(let a in props) {
            this._data[a] = props[a];
        }
    }

    hasProp(prop) {
        return typeof this._data[prop] !== 'undefined';
    }

    getProp(prop) {
        if (this.hasProp(prop)) {
            return this._data[prop];
        }
        return null;
    }

    setProp(prop, val) {
        this._data[prop] = val;
    }
}

module.exports = PropertySet;