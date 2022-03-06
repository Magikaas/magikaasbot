const JsonObject = require("../JsonObject");
const fs = require('fs');

class Character extends JsonObject {

    constructor() {
        super();

        this.__type = 'character';
    }

    generateId() {
        return super.generateId() + '_' + this.getFirstName()[0] + this.getLastName()[0] + '_' + this.getAge();
    }

    setAge(age) {
        this.set('age', age);
    }

    getAge() {
        return this.get('age');
    }

    setFirstName(firstname) {
        this.set('firstname', firstname);
    }

    getFirstName() {
        return this.get('firstname');
    }

    setLastName(lastname) {
        this.set('lastname', lastname);
    }

    getLastName() {
        return this.get('lastname');
    }

    getFullName() {
        return this.getFirstName() + ' ' + this.getLastName();
    }

    setExperienceThisLevel(exp) {
        this.set('expthislvl', exp);
    }

    getExperienceThisLevel() {
        return this.get('expthislvl');
    }

    static getType() {
        return 'character';
    }

    static generateCharacter(member = false) {
        const firstNames = require('../../data/first-names.json');
        const lastNames = require('../../data/last-names.json');
        const classes = require('../../data/classes.json');

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        const age = Math.floor(Math.random() * 35) + 18;
        const characterClass = classes[Math.floor(Math.random() * classes.length)];

        const characterData = {
            "class": characterClass,
            "firstname": firstName,
            "lastname": lastName,
            "age": age
        };

        const newCharacter = this.create(characterData);

        newCharacter.setMember(member);

        newCharacter.save();

        return newCharacter;
    }

    /**
     * Load a character for the member with a specific id.
     * 
     * @param {object} member 
     * @param {int} id 
     */
    static loadCharacter(member, id) {
        const characterData = this.load(member, id, this.getType());

        let character = this.create(characterData);

        character.setMember(member);
        character.setId(id);

        return character;
    }

    static loadAll(member) {
        const type = this.getType();
        const path = './' + (type ? type : this.getType()) + '/' + member.guild.id + '/' + member.id + '/';

        if (!this.guildHasCharacters(member.guild) || !this.memberHasCharacters(member)) {
            return [];
        }

        const files = fs.readdirSync(path);

        const characters = [];

        for (let file of files) {
            const id = file.substring(0, file.length - 5);

            let character = this.loadCharacter(member, id);

            characters.push(character);
        }

        return characters;
    }

    static guildHasCharacters(guild) {
        return fs.existsSync('./' + this.getType() + '/' + guild.id);
    }

    static memberHasCharacters(member) {
        return fs.existsSync('./' + this.getType() + '/' + member.guild.id + '/' + member.id);
    }

    randomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    static create(data) {
        let character = new Character();

        for (let d in data) {
            character.set(d, data[d]);
        }

        character.setId(character.generateId());

        return character;
    }

}

module.exports = Character;