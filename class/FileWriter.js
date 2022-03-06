const https = require("https");
const fs = require("fs");

class FileWriter {
    constructor() {
        this.setCategory("generic");
    }

    chooseFile(sourceUrl) {
        this.setSource(sourceUrl);
        this.setFilename(this.parseFileName(this.parseFullFileName(this.getSource())));
        this.extension = this.parseExtension(this.getSource());
    }

    setCategory(category) {
        this.category = category;
        return this;
    }

    getCategory() {
        return this.category;
    }

    setSource(sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    getSource() {
        return this.sourceUrl;
    }

    setFilename(filename) {
        this.filename = filename;
        return this;
    }

    getFilename() {
        return this.filename;
    }

    parseExtension(fileName) {
        var re = /(?:\.([^.]+))?$/;

        return re.exec(fileName)[1];
    }

    parseFullFileName(fileDir) {
        var re = /(?:\/([^/]+))?$/;

        return re.exec(fileDir)[1];
    }

    parseFileName(fileName) {
        var re = /^\/?(?:([^.]+)\.)?/;

        return re.exec(fileName)[1];
    }

    addFile(type) {
        let fileDir = "./" + type;

        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir);
        }

        const targetFile = fileDir + "/" + this.getFilename() + "." + this.parseExtension(this.sourceUrl);

        console.log("Writing " + type + " to " + targetFile);

        this.writeFile(targetFile, this.getSource());
    }

    addImage() {
        this.addFile("image");
    }

    addSound() {
        this.addFile("sound");
    }

    writeFile(fileName, sourceUrl) {
        const file = fs.createWriteStream(fileName);
        https.get(sourceUrl, function(response) {
            response.pipe(file);
        });
    }
}

module.exports = FileWriter;