module.exports = {
    name: "setlanguage",
    description: "Command description",
    async execute(message, args) {
        if (args.length > 0) {
            message.client.tts.language = args[0];
            message.reply("Set language to `" + args[0] + "`");
        }
    }
};
