const { dir } = require("console");
const fs = require("fs");

class AutoDiscovery {
    constructor() {
        this._files = [];
        this._classes = [];
    }

    run() {
        this.findFiles("./class");
        this.scan();
    }

    findFiles(directory) {
        // Index all files
        const files = fs.readdirSync(directory);

        let result = {};

        let tar = "";
        
        const regex = /^[a-zA-Z_]+\.js/;
        for (let file of files) {
            tar = directory + "/" + file;
            result = regex.exec(file);
            if (!result) {
                this.findFiles(tar);
            }
            else {
                this._files.push(tar);
            }
        }
    }

    scan() {
        for (let file of this._files) {
            this.parseFile(file);
        }
    }

    parseFile(file) {
        const contents = fs.readFileSync(file, "utf8");

        const regex = /^class\s(?<className>[a-zA-Z]+)/gm;

        const result = regex.exec(contents);

        if (!result || !result.groups || !result.groups.className) {
            // console.log("No classname found in", file);
            return;
        }

        let classConstructor = require("../" + file);

        if (typeof classConstructor == 'function') {
            new classConstructor();
        }
        else {
            // console.log(typeof classConstructor);
        }
    }
}

module.exports = AutoDiscovery;