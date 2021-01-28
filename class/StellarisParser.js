const fs = require("fs");
const { LOG10E } = require("mathjs");

const LINE_TYPE_CONSTANT =      "ltc";
const LINE_tYPE_BLOCKSTART =    "ltbs";
const LINE_TYPE_DEFAULT =       "ltd";
const LINE_TYPE_BLOCKEND =      "ltbe";
const LINE_TYPE_COMMENT =       "ltcm";

const emptyRegex =              new RegExp(/^\s*(#.*)?$/);
const defineRegex =             new RegExp(/(?<name>@[a-zA-Z0-9_]*)\s*=\s*(?<value>[a-zA-Z0-9\"]*)$/);
const simpleObjectRegex =       new RegExp(/(?<name>[a-zA-Z0-9_]*)\s*=\s*\{\s*(?<var>[a-zA-Z0-9_]*)\s*=\s*(?<val>[@a-zA-Z0-9_\"\.]*)\s*\}/);
const complexObjectRegex =      new RegExp(/(?<name>[a-zA-Z0-9_]*)\s*=\s*\{\s*/);
const logicObjectRegex =        new RegExp(/NOT|AND/);

class StellarisParser {

    constructor(client) {
        this.client = client;
        this.depth = 0;
    }
    parse(fileName) {
        const fileContents = this.readFile(fileName);

        this.readComplexObject(fileContents.split("\n"));
    }

    readFile(fileName) {
        const fileContents = fs.readFileSync(fileName);

        // console.log(fileContents.toString().split("\n"));

        return fileContents.toString();
    }

    process(contents) {
        let inBlock = true;

        for(let line of contents.split("\n")) {
            const lineType = this.determineLineType(line);

            // console.log(lineType);
            continue;
            switch (lineType) {
                case LINE_TYPE_CONSTANT:
                    // console.log("This line is a constant definition: " + line);
                    console.log("CON - " + line);
                    break;
                case LINE_tYPE_BLOCKSTART:
                    console.log("BLK - " + line);
                    break;
                case LINE_TYPE_BLOCKEND:
                    console.log("BLE - " + line);
                    break;
                default:
                    console.error("UNK - " + line);
            }
        }

        return {};
    }

    readComplexObject(lines, level, context) {
        let lineNumber = 0;

        console.log("Amount of lines to read: " + lines.length);

        let result = null;
        for (let line of lines) {
            lineNumber++;
            result = emptyRegex.exec(line);

            if (result) {
                this.logMessage("Empty line: " + lineNumber);
                continue;
            }

            result = simpleObjectRegex.exec(line);

            if (result) {
                this.logMessage("Simple Object: " + lineNumber);
                continue;
            }

            result = complexObjectRegex.exec(line);

            if (result) {
                this.logMessage("Complex Object " + lineNumber);
                
                continue;
            }
        }
    }

    readSimpleObject(line) {

    }

    logMessage(text, category = "stellaris_parser") {
        console.log(text);
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

        if (bareLine === "}") {
            return LINE_TYPE_BLOCKEND;
        }

        return LINE_TYPE_DEFAULT;
    }
}

module.exports = {
    StellarisParser
}