const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('playloop')
            .setDescription('Plays a random sound from a category on loop')
            .addStringOption(option =>
                option.setName('query')
                    .setDescription('The category you want to play sounds from.')
                    .setRequired(true)
                    .setAutocomplete(true)
            ),
    name: "playloop",
    voice: true,
    guildOnly: true,
    usage: "playloop <category>",
    cooldown: 5,
    active: true,
    autocomplete(interaction) {
        // Search the "sound" folder for all subfolders
        const soundFolder = "./sound/";
        const soundFolders = fs.readdirSync(soundFolder);

        // Create an array of autocomplete results
        const autocompleteResults = [];

        // Loop through all subfolders and add them to the autocomplete results
        // Only add folders, not files
        soundFolders.forEach(folder => {
            if (fs.statSync(soundFolder + folder).isDirectory()) {
                autocompleteResults.push({
                    name: folder,
                    value: folder
                });
            }
        });

        // Respond to the autocomplete request
        interaction.respond(autocompleteResults);
    },
    execute(interaction) {
        const soundName = interaction.options.getString('query');

        if (soundName.startsWith("http")) {
            message.reply("This command is used to play saved sound files. Please use `/play <url>/<searchTermn>` to play youtube video sound.");
            return;
        }

        Promise.resolve().then(function resolver() {
            return interaction.client.getVoiceHandler(interaction.guildId).playLoop(soundName)
            .then(function() {
                console.log("Playing sound: " + soundName);
                return interaction.client.getVoiceHandler(interaction.guildId).play(soundName);
            })
            .then(resolver);
        })
        .catch((error) => {
            console.error(error);
        });
    }
};