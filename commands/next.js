module.exports = {
    name: "dc",
    description: "Make the bot leave the voice channel.",
    execute(message, args) {
        message.client.ytQueueHandler.goToNext(message.member.guild.id);
    }
};