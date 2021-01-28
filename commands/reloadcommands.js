module.exports = {
    name: "reloadcommands",
    description: "Command description",
    async execute(message, args) {
        message.client.loadCommands(message.client.config);
    }
};
