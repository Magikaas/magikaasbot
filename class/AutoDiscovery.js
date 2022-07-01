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
        
        const regex = /^[a-zA-Z_]+\.js/;    // Only match files that start with a letter or underscore and end with .js (e.g. class.js)
        for (let file of files) {
            tar = directory + "/" + file;
            result = regex.exec(file);
            if (!result) {
                this.findFiles(tar);    // Recursively search for files
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

        const regex = /class\s(?<className>[a-zA-Z_]+)/gm;  // Match class names

        const result = regex.exec(contents);

        if (!result || !result.groups || !result.groups.className) {
            // console.log("No classname found in", file);
            return;
        }

        let classConstructor = require("../" + file);

        if (typeof classConstructor == 'function') {    // If the class is a function   (e.g. class A extends B)    then we need to get the prototype of the class  (e.g. class A)  and use that as the class name  (e.g. A)
            const instance = new classConstructor(); // Instantiate the class
            
            if (instance.constructor.name != result.groups.className) {
                console.log("Class name mismatch", instance.constructor.name, result.groups.className);
            }
        }
        else {
            // console.log(typeof classConstructor);
        }
    }
}

module.exports = new AutoDiscovery();