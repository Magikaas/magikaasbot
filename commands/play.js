module.exports = {
    name: "play",
    description: "Play a sound.",
    voice: true,
    execute(message, args) {
        const soundName = args.pop();

        // message.client.ytQueueHandler.start(message.member.guild.id);

        message.client.getVoiceHandler(message.guild.id).playSound(soundName);
    }
};