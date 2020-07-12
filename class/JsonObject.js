const DataObject = require("./DataObject");
const fs = require('fs');
const mkdirp = require("mkdirp");

class JsonObject extends DataObject.DataObject {
    
    static __type;

    constructor(id = false) {
        super();
        
        this._dataType = 'json';
        this._id = id;
    }

    static create(member) {
        return new self();
    }

    setId(id) {
        this._id = id;
    }

    getId() {
        return this._id ? this._id : this.generateId();
    }

    generateId() {
        return this.getDataType();
    }

    getType() {
        return this.__type;
    }

    getDataType() {
        return this._dataType;
    }

    getMember() {
        return this._member;
    }

    setMember(member) {
        this._member = member;
    }

    getFileDirectory() {
        return './' + this.getType() + '/' + this.getMember().guild.id + '/' + this.getMember().id + '/';
    }

    getFileName() {
        return this.getId() + '.json';
    }

    getFilePath() {
        return this.getFileDirectory() + this.getFileName();
    }

    static getType() {
        return this.__type;
    }

    static generateFilePath(member, id, type = false) {
        return '../' + (type ? type : this.__type) + '/' + member.guild.id + '/' + member.id + '/' + id + '.json';
    }

    save(member, id) {
        const path = this.getFileDirectory();

        console.log(path);

        const characterData = JSON.stringify(this.getData());

        mkdirp.sync(path, {}, function(err) {
            console.error(err);
        });

        fs.writeFileSync(this.getFilePath(), characterData);
    }

    static load(member, id, type = false) {
        const path = this.generateFilePath(member, id, type);

        const json = require(path);

        return json;
    }

    guaranteeFile(file) {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, "");
        }
    }
}

module.exports = {
    JsonObject
}