module.exports = {
    name: "reset",
    description: "Make the bot leave the voice channel.",
    execute(message, args) {
        message.client.getVoiceHandler(message.guild.id).getQueueHandler().resetQueue(message.member.guild.id);
    }
};