const DataLoader = require("./DataLoader");
const Character = require("./DND/Character");

class CharacterLoader extends DataLoader {
    constructor() {
        super();
        this.loadedCharacters = {};
    }

    loadCharacter(member, id) {
        const character = Character.loadCharacter(member, id);
        this.loadedCharacters[member.id] = character;
    }
}

module.exports = CharacterLoader;