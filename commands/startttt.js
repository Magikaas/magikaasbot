const ClassRepository = require("../class/AI/ClassRepository");
const Player = require("../class/AI/Generic/Player");

module.exports = {
    name: "startttt",
    description: "Command description",
    async execute(message, args) {
        const player = new Player();
        player.setId(message.author.id);

        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");

        const game = manager.initiateGame("tictactoe");

        manager.addPlayerToGame(game, player);
        
        const tictactoeAI = repo.fetchClass("TicTacToeAI");

        tictactoeAI.setId(123);

        manager.addPlayerToGame(game, tictactoeAI);
        tictactoeAI.simulate();

        manager.startGame(game);

        message.reply("Game started with ID: " + game.getId());
    }
};
