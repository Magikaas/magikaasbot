module.exports = {
    name: "fart",
    description: "Fart.",
    voice: true,
    excluded: true,
    execute(message, args) {
        message.client.voiceHandler.playSound("fart");

        setTimeout(() => {
            if (message.client.voice.connections.find(connection => connection)) {
                message.client.voice.connections.find(connection => connection).disconnect();
            }
        }, 2000);
    }
};