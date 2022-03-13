const { DBGameType } = require("../../../mysql/tables");

class GameType {
    constructor() {
        this._id = null;
        this._name = null;
        this._className = null;
        this._boardstateClass = null;
        this._defaultBoardstateId = 0;
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
        return this;
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
        return this;
    }

    getClassName() {
        return this._className;
    }

    setClassName(className) {
        this._className = className
        return this;
    }

    getBoardstateClass() {
        return this._boardstateClass;
    }

    setBoardstateClass(boardstateClass) {
        this._boardstateClass = boardstateClass;
        return this;
    }

    getDefaultBoardstateId() {
        return this._defaultBoardstateId;
    }
    
    setDefaultBoardstateId(defaultBoardstateId) {
        this._defaultBoardstateId = defaultBoardstateId;
        return this;
    }

    /**
     * 
     * @param {Object} attr 
     * @returns {GameType}
     */
    static async load(attr) {
        let output = await DBGameType.findAll({
            attributes: ['id', 'name', 'class'],
            where: attr
        });

        if (output.length > 0) {
            output = output.pop();
        }

        let obj = new GameType();

        obj.setId(output.id)
        .setName(output.name)
        .setClassName(output.class);

        return obj;
    }

    static getById(id) {
        return this.load({ id: id });
    }

    static getByName(gametype) {
        return this.load({ name: gametype });
    }
}

module.exports = GameType;