const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("[S] Stops the Queue.")
        .setDMPermission(false),
    name: "stop",
    description: "[S] Stops the Queue.",
    active: true,
    async execute(interaction) {
        interaction.client.getVoiceHandler(interaction.guildId).stop();
        interaction.reply("Stopped the queue.");
    }
};