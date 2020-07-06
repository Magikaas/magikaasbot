module.exports = {
    name: "dc",
    description: "Make the bot leave the voice channel.",
    voice: true,
    execute(message, args) {
        try {
            if (message.client.getVoiceHandler(message.guild.id).isConnected()) {
                message.client.getVoiceHandler(message.guild.id).disconnect();
            }
        }
        catch (error) {
            console.error(error);
        }
    }
};