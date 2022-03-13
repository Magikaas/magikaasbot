const crypto = require('crypto');
const ClassRepository = require("./AI/ClassRepository");
const DatabaseState = require('./DatabaseState');

class General {
    constructor() {
        const repo = ClassRepository;
        repo.registerClass(this.constructor.name, this.constructor);
        this._databaseState = {};
    }

    hash(value) {
        const md5sum = crypto.createHash('md5');
        return md5sum.digest(value);
    }

    /**
     * Fetch the repo, to load classes
     * 
     * @returns {ClassRepository}
     */
    getRepo() {
        return ClassRepository;
    }

    getDatabaseState(key) {
        return this._databaseState[key] ? this._databaseState[key] : DatabaseState.Idle;
    }

    isUnderDBInteraction(key) {
        return this.getDatabaseState(key) !== DatabaseState.Idle;
    }

    isLoading(key) {
        return this.getDatabaseState(key) === DatabaseState.Loading;
    }

    isSaving(key) {
        return this.getDatabaseState(key) === DatabaseState.Saving;
    }

    setDatabaseState(key, value) {
        this._databaseState[key] = value;
    }

    setSaving(key) {
        this.setDatabaseState(key, DatabaseState.Saving);
    }

    setLoading(key) {
        this.setDatabaseState(key, DatabaseState.Loading);
    }

    finish(key) {
        this.setDatabaseState(key, DatabaseState.Idle);
    }
}

module.exports = General;