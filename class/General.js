const crypto = require('crypto');
const ClassRepository = require("./AI/ClassRepository");

class General {
    constructor() {
        const repo = ClassRepository;
        repo.registerClass(this.constructor.name, this.constructor);

        // Proxy for getters
        return new Proxy(this, {
            get: function(object, prop, param) {
                if (prop in object) return object[prop];

                if (prop === 'then') return null;

                return function () {
                    console.trace("NO FUNCTION FOUND", prop);
                    return false;
                }
            }
        });
    }

    hash(value) {
        const md5sum = crypto.createHash('md5').update(value.toString());
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