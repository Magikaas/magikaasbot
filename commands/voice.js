module.exports = {
    name: "voice",
    description: "Join a voice channel.",
    execute(message, args) {
        let voiceChannel = {};
        if (message.member.voice.channel) {
            voiceChannel = message.member.voice.channel;
        }
        else {
            const channelName = "Je Hoofd";
            voiceChannel = message.guild.channels.cache.find(channel => channel.name === channelName);
        }

        message.client.voiceHandler.setChannel(voiceChannel);

        message.client.voiceHandler.connect();
    }
};