const fs = require('fs');

module.exports = {
    name: "play",
    description: "Play a sound.",
    voice: true,
    execute(message, args) {
        const soundName = args.pop();

        message.client.voiceHandler.playSound(soundName);
    }
};