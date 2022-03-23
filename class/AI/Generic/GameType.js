const { DBGameType } = require("../../../mysql/tables");
const DBObject = require("./DB/DBObject");

class GameType extends DBObject {
    static _dbObjectBase = DBGameType;
    constructor() {
        super();
        this._name = null;
        this._gameclassname = null;
        this._boardstateClass = null;
        this._defaultBoardstateId = 0;
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
        return this;
    }

    getGameClassname() {
        return this._gameclassname;
    }

    setGameClassname(className) {
        this._gameclassname = className;
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
        const [dbModel, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'name', 'class', 'boardstateclass', 'boardstateId'],
            where: attr
        });
        
        if (created) {
            return null;
        }

        let gametype = this.create();
        
        gametype._dbObject = dbModel;

        gametype.setId(dbModel.id)
            .setName(dbModel.name)
            .setGameClassname(dbModel.class)
            .setBoardstateClass(dbModel.boardstateclass)
            .setDefaultBoardstateId(dbModel.boardstateId);

        return gametype;
    }

    async save() {
        this._dbObject.boardstateId = this.getDefaultBoardstateId();

        super.save();
    }

    static async loadById(id) {
        return await this.load({ id: id });
    }

    static async loadByName(name) {
        return await this.load({ name: name });
    }
}

module.exports = GameType;