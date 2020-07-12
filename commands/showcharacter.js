const Character = require("../class/DND/Character");

module.exports = {
    name: "showcharacter",
    description: "Show the details of a specific character.",
    help: "showcharacter",
    execute(message, args) {
        const character = Character.Character.loadCharacter(message.member, args[0]);
        
        let embedObject = {
            color: 0x00ff00,
            title: character.getFullName(),
            author: {
                name: "Character",
                icon_url: "https://i.pinimg.com/originals/48/cb/53/48cb5349f515f6e59edc2a4de294f439.png"
            },
            description: "The details of your character.",
            thumbnail: {},
            fields : [],
            image: {},
            timestamp: new Date(),
            footer: {
                text: character.getFullName(),
                icon_url: "https://i.pinimg.com/originals/48/cb/53/48cb5349f515f6e59edc2a4de294f439.png"
            }
        };

        for (let prop in character.getData()) {
            embedObject.fields.push({
                name: prop.charAt(0).toUpperCase() + prop.slice(1),
                value: character.get(prop)
            });
        }

        message.reply({ embed: embedObject});
    }
};