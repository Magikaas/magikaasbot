const DNDAPIFetcher = require("../class/DNDAPIFetcher");
const Discord = require("discord.js");
const { json } = require("mathjs");

module.exports = {
    name: "spell",
    description: "Get information on a D&D spell",
    async execute(message, args) {
        const dndApiFetcher = new DNDAPIFetcher();

        dndApiFetcher.fetchSpell(args.join(" "))
            .then((output) => {
                const jsonData = JSON.parse(output);

                let aoe = "";
                
                if (jsonData.area_of_effect) {
                    aoe = " (" + jsonData.area_of_effect.size + "ft " + jsonData.area_of_effect.type + ")";
                }
                
                let classes = [];

                for (let classInfo of jsonData.classes) {
                    classes.push(classInfo.name);
                }

                const embedMessage = new Discord.MessageEmbed()
                    .setColor(".#0099ff")
                    .setTitle(jsonData.name)
                    .addFields([
                        { name: "Casting time", value: jsonData.casting_time, inline: true },
                        { name: "Range", value: jsonData.range + aoe, inline: true },
                        { name: "School of Magic", value: jsonData.school.name, inline: true },
                        { name: "Duration", value: jsonData.duration, inline: true },
                        { name: "Material", value: jsonData.material, inline: true },
                        { name: "Concentration", value: jsonData.concentration ? "Yes" : "No", inline: true },
                        { name: "Components", value: jsonData.components.join(", "), inline: true },
                        { name: "Description", value: jsonData.desc },
                        { name: "At Higher Levels", value: jsonData.higher_level },
                        { name: "Classes", value: classes.join(", ") }
                    ]);

                message.reply(embedMessage);
            })
            .catch((error) => {
                console.log(error);
            });
    }
};
