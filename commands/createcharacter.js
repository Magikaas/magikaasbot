const Character = require("../class/DND/Character");

module.exports = {
    name: "createcharacter",
    description: "Generate a new character.",
    help: "createcharacter <firstname> <lastname> <age>",
    execute(message, args) {
        if (args.length == 0) {
            message.reply("Please provide a name and age for the character. The rest can be added through commands afterward.");
        }
        const character = Character.Character.create({
            "firstname": args[0],
            "lastname": args[1],
            "age": args[2]
        });

        character.setMember(message.member);

        character.save();
    }
};