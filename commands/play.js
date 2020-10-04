module.exports = {
    name: "play",
    description: "Play a sound.",
    voice: true,
    execute(message, args) {
        const soundName = args.pop();

        if (soundName.startsWith("http")) {
            message.reply("This command is used to play saved sound files. Please use `" + message.client.prefix + " yt <url>` to play youtube video sound.");
            return;
        }

        console.log("Playing: " + soundName);

        message.client.getVoiceHandler(message.guild.id).playSound(soundName);
    }
};