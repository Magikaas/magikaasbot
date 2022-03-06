class ClassRepository {
    constructor() {
        this.classes = {};
        this._cache = {};
    }

    /**
     * Register a class in the repository for easy fetching.
     * 
     * @param {String} className 
     * @param {Object} instance 
     * @returns {ClassRepository}
     */
    registerClass(className, instance, overwrite = false) {
        // Only register unregistered classes or if specifically told to overwrite if it exists
        if (typeof this.classes[className] == 'undefined' || overwrite) {
            console.log("Registered class", className, "as", instance);
            this.classes[className] = instance;
        }
        return this;
    }
    
    /**
     * Fetch a registered class
     * 
     * @param {String} className 
     * @returns {Object}
     */
    fetchClass(className, cache = false) {
        if (className == "GameManager") {
            // GameManager is a singleton, always return the singleton
            return require("./Generic/GameManager");
        }
        console.log("Fetching class", className, "Cache:", cache);
        const classObj = this.classes[className];
        if (typeof classObj != 'undefined') {
            if (cache && this.isCached(className)) {
                return this.getCache(className);
            }
            
            const instance = new this.classes[className]();
            
            this.putCache(className, instance);

            return instance;
        }

        return null;
    }

    putCache(className, instance) {
        this._cache[className] = instance;
        return this;
    }

    getCache(className) {
        return this._cache[className];
    }

    isCached(className) {
        return typeof this._cache[className] != 'undefined';
    }
}
module.exports = new ClassRepository();