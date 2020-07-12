const DataObject = require("./DataObject");

class DatabaseObject extends DataObject.DataObject {

    constructor(connection) {
        parent();
        
        this.connection = connection;
    }
    save() {
        this.prepDatabaseObject()
        .then(dbObject => {
            for (let prop in this._data) {
                dbObject[prop] = this.get(prop);
            }

            dbObject.save();
        })
        .catch(error => {
            console.error(error);
        });
    }

    getConnection() {
        return this.connection;
    }

    load(id) {
        console.log("Not yet implemented");
    }
    
    async loadByProperties(props) {
        this.getConnection().findOne({
            attributes: this._data.keys,
            where: props
        })
        .then(object => {
            for (const prop in object) {
                this.set(prop, object[prop]);
            }
        });
    }

    prepDatabaseObject(id) {
        this.getConnection().create(this._data);

        return dbObject;
    }

    id() {
        return this._id;
    }
}

module.exports = {
    DatabaseObject
}