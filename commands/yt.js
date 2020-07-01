const ytdl = require('ytdl-core');

module.exports = {
    name: "yt",
    description: "Play a youtube video in a voice channel.",
    voice: true,
    async execute(message, args) {
        const songInfo = await ytdl.getInfo(args[0]);

        message.channel.send("Now playing: " + songInfo.title);

        message.client.getVoiceHandler(message.guild.id).play(ytdl(args[0]));
    }
};