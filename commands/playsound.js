// Path: commands/playsound.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playsound')
        .setDescription('Command description')
        .addStringOption(option =>
            option.setName('file')
                .setDescription('File to play')
                .setRequired(true),
        ),
    name: "playsound",
    description: "Command description",
    usage: "Command usage",
    voice: true,
    active: true,
    async execute(interaction) {
        const soundName = interaction.options.getString('file');

        if (soundName.startsWith("http")) {
            interaction.reply("This command is used to play saved sound files. Please use `/play <url>/<searchTermn>` to play youtube video sound.");
            return;
        }

        interaction.client.getVoiceHandler(interaction.guildId).play("./sound/" + soundName + ".mp3");

        interaction.reply("Playing sound: " + soundName);
    }
};
