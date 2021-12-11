module.exports = {
    name: "setgender",
    description: "Command description",
    async execute(message, args) {
        if (args.length > 0) {
            message.client.tts.gender = args[0];
            message.reply("Set gender to `" + args[0] + "`");
        }
    }
};
