module.exports = {
    name: "nerd",
    description: "Call someone a nerd",
    execute(message, args) {
        message.channel.send(args[0] + " is een nerd!");
    }
};