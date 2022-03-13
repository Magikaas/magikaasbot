const ClassRepository = require("../class/AI/ClassRepository");
const Player = require("../class/AI/Generic/Player");

module.exports = {
    name: "simttt",
    description: "Command description",
    async execute(message, args) {
        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");

        const game = await manager.initiateGame("tictactoe");
        
        const tictactoeAI = repo.fetchClass("TicTacToeAI");

        tictactoeAI.setId(123);

        tictactoeAI.save();

        manager.addPlayerToGame(game, tictactoeAI);
        tictactoeAI.simulate();

        const otherAI = repo.fetchClass("TicTacToeAI");

        otherAI.setId(124);
        manager.addPlayerToGame(game, otherAI);
        otherAI.simulate();

        manager.startGame(game);

        message.reply("Game started with ID: " + game.getId());
    }
};
