module.exports = {
    name: "adminonly",
    description: "Command description",
    async execute(message, args) {
        const commandName = args[0];

        if (message.client.commands[commandName]) {
            message.client.commands[commandName].adminOnly = args[1] === "true";
        }
    }
};
