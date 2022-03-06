const fs = require("fs");
const StellarisParser = require("./StellarisParser");

class StellarisFileParser extends StellarisParser {

    constructor(client) {
        super();
        this.client = client;
        this.depth = 0;
    }
}

module.exports = StellarisFileParser;