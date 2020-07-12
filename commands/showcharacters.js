const Character = require("../class/DND/Character");

module.exports = {
    name: "showcharacters",
    description: "List all your characters.",
    help: "showcharacters <class/race> <classname/racename>",
    execute(message, args) {
        const characters = Character.Character.loadAll(message.member);

        let filter = {};

        if (args.length > 0) {
            filter = {
                "prop": args[0],
                "value": args[1]
            };
        }
        
        let embedObject = {
            color: 0x00ff00,
            title: "Characters",
            author: {
                name: message.member.name,
                icon_url: "https://i.pinimg.com/originals/48/cb/53/48cb5349f515f6e59edc2a4de294f439.png"
            },
            description: "A list of all your characters in this server.",
            thumbnail: {},
            fields : [],
            image: {},
            timestamp: new Date(),
            footer: {
                text: "Your characters",
                icon_url: "https://i.pinimg.com/originals/48/cb/53/48cb5349f515f6e59edc2a4de294f439.png"
            }
        };

        for (let character of characters) {
            if (args.length > 0) {
                if (character[filter.prop] !== filter.value) {
                    continue;
                }
            }
            
            embedObject.fields.push({
                name: character.getFullName(),
                value: character.getId()
            });
        }

        if (embedObject.fields.length === 0) {
            message.reply("Unable to find any characters, please create one first with `" + message.client.prefix + " createcharacter <firstname> <lastname> <age>`");
            return;
        }

        message.reply({ embed: embedObject});
    }
};