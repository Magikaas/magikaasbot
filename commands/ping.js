module.exports = {
    name: "ping",
    description: "Show the bot's ping",
    help: "ping",
    excluded: true,
    execute(message, args) {
        message.channel.send('Pong! Your ping is `' + `${Date.now() - message.createdTimestamp}` + ' ms`');
    }
};