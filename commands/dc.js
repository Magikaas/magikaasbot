module.exports = {
    name: "dc",
    description: "Leave a voice channel.",
    execute(message, args) {
        if (message.client.voiceHandler.isConnected()) {
            message.client.voiceHandler.disconnect();
        }
    }
};