const fs = require("fs");
const StellarisParser = require("./StellarisParser");

class StellarisObjectParser extends StellarisParser {

    constructor() {
        super();
    }
    
    parse(lines) {
        let thisObject = {
            properties: {}
        };
        for (let line of lines) {
            
        }
    }
}

module.exports = StellarisObjectParser;