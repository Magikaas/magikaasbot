const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip to next song in queue.")
        .setDMPermission(false),
    name: "skip",
    requiredRoles: ["admin", "Nitro Booster", "Patreon Supporters"],
    description: "[S] Skip to next song in queue.",
    playing: true,
    execute(interaction) {
        interaction.client.ytQueueHandler.getVoiceHandler(guildId).endPlaying();
        interaction.reply("Skipped to next song in queue.");
    }
};