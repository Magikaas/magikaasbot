module.exports = {
    name: "skip",
    description: "Skip to next song in queue.",
    playing: true,
    execute(message, args) {
        message.client.ytQueueHandler.getVoiceHandler(guildId).endPlaying();
    }
};