const crypto = require('crypto');

class ObjectManager{
    constructor() {
        this._objects = {};
    }

    put(object) {
        // If the object was not saved before, save it now, code may need to be refactored to work like this
        if (!object._id) {
            object.save();
        }
        this._objects[object.constructor.name][object.getId()] = object;
    }

    fetch(objectClass, id) {
        return this._objects[objectClass][id];
    }

    fetchList(objectClass, ids) {
        let objects = [];

        for (let id of ids) {
            objects.push(this._objects[objectClass][id]);
        }

        return objects;
    }

    hash(value) {
        const md5sum = crypto.createHash('md5').update(JSON.stringify(value));
        return md5sum.digest('hex');
    }
}

module.exports = new ObjectManager();