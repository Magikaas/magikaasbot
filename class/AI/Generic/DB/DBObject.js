const General = require("../../../General");
const ClassRepository = require("../../ClassRepository");

class DBObject extends General {
    constructor() {
        super();
        this._id = null;
        this._data = {};
        this._dbObject = {};
        this._dbObjectBase = {};
    }

    setId(id) {
        this._id = id;
        return this;
    }

    getId() {
        return this._id;
    }

    setDBObject(dbObject) {
        if (dbObject.hash) console.trace("Incorrect dbobject found");
        this._dbObject = dbObject;
        return this;
    }

    getDBObject() {
        return this._dbObject;
    }

    // TODO: Possibly remove this if setters/getters work correctly
    setDBObjectProp(prop, object) {
        this._dbObject["set" + prop](object);
        return this;
    }

    getDBObjectProp(prop) {
        return this._dbObject["get" + prop]();
    }

    static async load() {
        throw new Error("Implement this function in " + this.constructor.name + ". Unable to load.");
    }

    async save() {
        try {
            await this._dbObject.save();
        }
        catch (err) {
            console.log("Problem saving", this.constructor.name, "Error", err);
        }
        
        this.setId(this._dbObject.id);
    }

    static create() {
        const className = this.name;

        const object = ClassRepository.fetchClass(className);

        if (!this._dbObjectBase) {
            throw new Error("No database object base defined for " + this.name);
        }

        object._dbObject = this._dbObjectBase.build();

        return object;
    }

    // Run static create function from instance
    create() {
        return this.constructor.create();
    }
}

module.exports = DBObject;