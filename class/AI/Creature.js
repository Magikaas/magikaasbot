class Creature {
    constructor(x, y, props) {
        this._x = x;
        this._y = y;
        if (!props) {
            
        }
        this._props = props;
    }

    getX() {
        return this._x;
    }

    setX(x) {
        this._x = x;
        return this;
    }

    getY() {
        return this._y;
    }

    setY(y) {
        this._y = y;
        return this;
    }

    getCoordinates() {
        return {
            "x": this.getX(),
            "y": this.getY()
        };
    }

    navigateTo(x, y) {
        let dX = this.getX() - x;
    }

    moveTo(x, y) {
        this.setX(x).setY(y);
    }

    getProperty(prop) {
        return this._props[prop];
    }

    setProperty(prop, value) {
        this._props[prop] = value;
    }
}