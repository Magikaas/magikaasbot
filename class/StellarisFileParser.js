const fs = require(("fs"));
const DataLoader = require(("./StellarisParser"));

class StellarisFileParser extends StellarisParser {

    constructor(client) {
        this.client = client;
        this.depth = 0;
    }
    

}

module.exports = StellarisFileParser