const fs = require('fs');

module.exports = {
    name: "yt",
    description: "Play a youtube video in a voice channel.",
    voice: true,
    execute(message, args) {
        const soundName = args.pop();

        message.client.voiceHandler.playYT(url);
    }
};