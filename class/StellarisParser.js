const fs = require(("fs"));
const { LOG10E } = require("mathjs");

const LINE_TYPE_CONSTANT =      "constant";
const LINE_tYPE_BLOCKSTART =    "blockstart";
const LINE_TYPE_DEFAULT =       "default";
const LINE_TYPE_BLOCKEND =      "blockend";
const LINE_TYPE_COMMENT =       "comment";
const LINE_TYPE_EMPTY =         "empty";

const emptyRegex =              new RegExp(/^\s*(#.*)?$/);
const defineRegex =             new RegExp(/(?<name>@[a-zA-Z0-9_]*)\s*=\s*(?<value>[a-zA-Z0-9\"]*)$/);
const simpleObjectRegex =       new RegExp(/(?<name>[a-zA-Z0-9_]*)\s*=\s*\{\s*(?<var>[a-zA-Z0-9_]*)\s*=\s*(?<val>[@a-zA-Z0-9_\"\.]*)\s*\}/);
const complexObjectRegex =      new RegExp(/(?<name>[a-zA-Z0-9_]*)\s*=\s*\{\s*/);
const complexObjectEndRegex =   new RegExp(/^\s*\}/);
const logicObjectRegex =        new RegExp(/NOT|AND/);

class StellarisParser {

    constructor(client) {
        this.client = client;
        this.state = {
            depth: 0,
            lineNumber: 0
        };
    }

    parse(fileName) {
        const fileContents = this.readFile(fileName);

        this.readComplexObject(fileContents.split("\n"));
    }

    readFile(fileName) {
        const fileContents = fs.readFileSync(fileName);

        return fileContents.toString();
    }

    readComplexObject(lines) {
        let relativeLineNumber = 0;

        console.log("Amount of lines to read: " + lines.length);

        let lineType = "";

        let result = null;
        for (let line of lines) {
            relativeLineNumber++;
            
            lineType = this.determineLineType(line);

            this.logMessage(relativeLineNumber + "|" + line.replace(/\r?\n|\r/, "") + ": " + lineType);
        }
    }

    readSimpleObject(line) {

    }

    logMessage(text, category = "stellaris_parser") {
        // console.log(text);
        this.client.writeLog(text, category);
    }

    determineLineType(line) {
        const spaceRegex = /\s*/gi;
        const bareLine = line.replace("\t", "    ").replace("\r", "").replace("\n", "");

        let match = null;

        if ((match = simpleObjectRegex.exec(bareLine)) !== null) {

            console.log(match);
        }

        if ((match = complexObjectRegex.exec(bareLine)) !== null) {
            // console.log(match);
        }

        if (bareLine.startsWith("@")) {
            return LINE_TYPE_CONSTANT;
        }

        if (bareLine.endsWith("{")) {
            return LINE_tYPE_BLOCKSTART;
        }

        if (bareLine.endsWith("}")) {
            return LINE_TYPE_BLOCKEND;
        }

        if (bareLine === "") {
            return LINE_TYPE_EMPTY;
        }

        return LINE_TYPE_DEFAULT;
    }
}

module.exports = StellarisParser