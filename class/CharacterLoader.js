const DataLoader = require("./DataLoader");
const Character = require("./DND/Character");

class CharacterLoader extends DataLoader {
    loadedCharacters = {};

    loadCharacter(member, id) {
        const character = Character.loadCharacter(member, id);
        this.loadedCharacters[member.id] = character;
    }

    loadAllCharacters(member} {
        const characters = Character.loadAll(member);
    }
}

module.exports = CharacterLoader