module.exports = {
    name: "playloop",
    description: "Play random sounds from a category on loop.",
    voice: true,
    execute(message, args) {
        const soundName = args.pop();

        if (soundName.startsWith("http")) {
            message.reply("This command is used to play saved sound files. Please use `" + message.client.prefix + " yt <url>` to play youtube video sound.");
            return;
        }

        Promise.resolve().then(function resolver() {
            return message.client.getVoiceHandler(message.guild.id).playLoop(soundName)
            .then(function() {
                message.client.getVoiceHandler(message.guild.id).play(soundName);
            })
            .then(resolver);
        })
        .catch((error) => {
            console.error(error);
        });
    }
};