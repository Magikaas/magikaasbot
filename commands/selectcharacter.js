const Character = require("../class/DND/Character");

module.exports = {
    name: "selectcharacter",
    description: "Set a character as active.",
    help: "selectcharacter",
    execute(message, args) {
        message.client.characters[message.member.id] = Character.Character.load(message.member, args[0]);
    }
};