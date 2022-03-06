const { DBGameType } = require("../../../mysql/tables");

class GameType {
    constructor() {
        this._id = null;
        this._name = null;
        this._className = null;
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

    static async load(attr) {
        const output = DBGameType.findAll({
            attributes: ['id', 'name', 'class'],
            where: attr
        });

        console.log("Gametype DB", output);

        let obj = new GameType();

        obj.setId(output.id)
        .setName(output.name)
        .setClassName(output.classname);

        return obj;
    }

    static async getById(id) {
        return this.load({ id: id });
    }

    static async getByName(gametype) {
        return this.load({ name: gametype });
    }
}

module.exports = GameType;