const ClassRepository = require("../class/AI/ClassRepository");

module.exports = {
    name: "ttt",
    description: "Command description",
    async execute(message, args) {
        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");
        
        const game = manager.getGame(args.shift());

        const player = manager.getPlayer(message.author.id);

        const square = args.shift();

        const move = {
            square: square,
            game: game.getId(),
            player: player.getId()
        };

        manager.submitMove(move);
    }
};
