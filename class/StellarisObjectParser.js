const fs = require("fs");
const DataLoader = require("./StellarisParser");

class StellarisObjectParser extends StellarisParser.StellarisParser {

    constructor() {}
    
    parse(lines) {
        let thisObject = {
            properties: {}
        };
        for (let line of lines) {
            
        }
    }
}

module.exports = {
    StellarisObjectParser
}