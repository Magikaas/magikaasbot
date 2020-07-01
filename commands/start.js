module.exports = {
    name: "start",
    description: "Start the queue.",
    voice: true,
    execute(message, args) {
        if (!message.client.ytQueueHandler.start(message.guild.id)) {
            message.reply("Unable to start the queue. No queue was found.");
        } else {
            message.reply("Queue finished");
        }
    }
};