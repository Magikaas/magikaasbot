const { DBMove } = require("../../../mysql/tables");
const DBObject = require("./DB/DBObject");

class Move extends DBObject {
    static _dbObjectBase = DBMove;
    constructor() {
        super();
        this._data = {};
    }

    setData(data) {
        this._data = data;
        return this;
    }

    getData() {
        return this._data;
    }

    static async load(id) {
        const [dbData, created] = await this._dbObjectBase.findOrBuild({
            where: {
                id: id
            }
        });

        if (created) {
            return null;
        }

        let move = this.create();

        move.setData(JSON.parse(dbData.data));

        return move;
    }

    async save() {
        this._dbObject.data = JSON.stringify(this.getData());
        super.save();
    }
}

module.exports = Move;