const ClassRepository = require("../class/AI/ClassRepository");

module.exports = {
    name: "checkturn",
    description: "Command description",
    async execute(message, args) {
        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");

        message.reply("Game's turn:" + manager.getGameTurn(args.pop()));
    }
};
