const crypto = require('crypto');
const ClassRepository = require("./AI/ClassRepository");

class General {
    constructor() {
        const repo = ClassRepository;
        repo.registerClass(this.constructor.name, this.constructor);
    }

    hash(value) {
        const md5sum = crypto.createHash('md5');
        return md5sum.digest(value);
    }
}

module.exports = General;