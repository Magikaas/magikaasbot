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
        let dbData = await this._dbObjectBase.findOne({
            attributes: ['id', 'name', 'class', 'boardstateclass'],
            where: attr
        });
        
        if (!dbData) {
            console.log("Could not load gametype with attr", attr);
            return null;
        }

        // console.log("Loaded gametype with attr", attr);

        let obj = this.create();

        obj.setId(dbData.id)
            .setName(dbData.name)
            .setGameClassname(dbData.class)
            .setBoardstateClass(dbData.boardstateclass);

        return obj;
    }

    static async loadById(id) {
        return await this.load({ id: id });
    }

    static async loadByName(name) {
        return await this.load({ name: name });
    }
}

module.exports = GameType;