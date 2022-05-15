const crypto = require('crypto');
const ClassRepository = require("./AI/ClassRepository");
const ObjectManager = require('./AI/ObjectManager');

class General {
    constructor() {
        const repo = ClassRepository;

        this.objectManager = ObjectManager;
        this._objectIds = {};
        const object = this;

        repo.registerClass(this.constructor.name, this.constructor);

        // Proxy for getters
        return new Proxy(this, {
            get: function(object, prop, param) {
                if (prop in object) return object[prop];

                // Catch then for Promisified objects
                if (prop === 'then') return null;
                // Catch toJSON for JSONifying objects
                if (prop === "toJSON") return null;

                const regexp = /^(?<fn>get|set)(?<property>[A-Z][a-z]+)$/;
                const regexpPlural = /^(?<fn>get|set)(?<property>[A-Z][a-z]+)s$/;
                let fn = "";
                let property = "";
                let result = null;
                let functionName = prop;
                let plural = false;

                if (result = regexp.exec(functionName)) {
                    console.log("Function call:", functionName, result);
                    
                    fn = result.groups.fn;
                    property = result.groups.property;
                    let pluralResult = null;

                    if (pluralResult = regexpPlural.exec(functionName)) {
                        plural = true;
                    }

                    console.log(object._objectIds);

                    if (fn === "get") {
                        if (plural) {
                            return ObjectManager.fetchList(property, object._objectIds[property]);
                        }
                        return ObjectManager.fetch(property, object._objectIds[property][0]);
                    }
                    if (fn === "set") {
                        ObjectManager.put(param);
                        if (!object._objectIds[property]) {
                            // If we don't have a list of objects of this type yet, create it and add the set object
                            object._objectIds[property] = [];
                            object._objectIds[property].push(param.getId());
                        }
                        else {
                            // We have the list already, add the ID if it's not already there
                            if (!object._objectIds[property].includes(param.getId())) {
                                object._objectIds[property].push(param.getId());
                            }
                        }
                    }
                }

                return function () {
                    console.trace("NO FUNCTION FOUND ON", this.constructor.name, prop);
                    return false;
                };
            }
        });
    }

    hash(value) {
        const md5sum = crypto.createHash('md5').update(JSON.stringify(value));
        return md5sum.digest('hex');
    }

    /**
     * Fetch the repo, to load classes
     * 
     * @returns {ClassRepository}
     */
    getRepo() {
        return ClassRepository;
    }
}

module.exports = General;