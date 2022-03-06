class Match {
    AI_ONLY = 0;
    AI_PLAYER = 1;
    PLAYER_PLAYER = 2;
    
    constructor() {
        this.initialise();
    }

    save() {

    }

    initialise() {
        this._boardStates = [];
        this._type = false;
        this._dbObject = {};
    }

    setType(type) {
        this._type = type;
        return this;
    }

    getType() {
        return this._type;
    }
}

module.exports = Match;