module.exports = {
    name: "voice",
    description: "Make the bot join a voice channel.",
    voice: true,
    execute(message, args) {
        let voiceChannel = {};
        if (args.length > 0) {
            const channelName = args.join(" ");
            voiceChannel = message.guild.channels.cache.find(channel => channel.name === channelName);
        }
        else if (message.member.voice.channel) {
            voiceChannel = message.member.voice.channel;
        }
        else {
            message.reply("You need to either be in a voice channel or provide a channel name to make the bot join a voice channel.");
        }

        message.client.getVoiceHandler(message.guild.id).setChannel(voiceChannel);

        try {
            message.client.getVoiceHandler(message.guild.id).connect();
        }
        catch (error) {
            console.error(error);
        }
    }
};