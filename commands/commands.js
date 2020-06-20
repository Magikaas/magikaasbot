module.exports = {
    name: "commands",
    description: "Show this list.",
    execute(message, args) {
        let embedObject = {
            color: 0x00ff00,
            title: "Commands",
            author: {
                name: "Commands",
                icon_url: "https://w7.pngwing.com/pngs/466/304/png-transparent-yui-hirasawa-azusa-nakano-tsumugi-kotobuki-mio-akiyama-ritsu-tainaka-chibi-child-mammal-face.png",
                url: "http://www.google.com/"
            },
            description: "A list of all the commands usable with this bot.",
            thumbnail: {},
            fields : [],
            image: {},
            timestamp: new Date(),
            footer: {
                text: "footer text",
                icon_url: "https://w7.pngwing.com/pngs/466/304/png-transparent-yui-hirasawa-azusa-nakano-tsumugi-kotobuki-mio-akiyama-ritsu-tainaka-chibi-child-mammal-face.png"
            }
        };

        for (let command of message.client.commands) {
            let cmd = command.pop();

            if (cmd.excluded) {
                continue;
            }
            embedObject.fields.push({
                name: cmd.name,
                value: cmd.description
            });
        }

        console.log(message.client.commands);

        message.reply({ embed: embedObject});
    }
};