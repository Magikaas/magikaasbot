class Grid {
    constructor(width, height) {
        this._w = width;
        this._h = height;
    }

    getWidth() {
        return this._w;
    }

    getHeight() {
        return this._h;
    }
}

module.exports.Grid = Grid;