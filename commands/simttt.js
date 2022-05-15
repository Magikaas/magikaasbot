const ClassRepository = require("../class/AI/ClassRepository");
const GameManager = require("../class/AI/Generic/GameManager");
const TicTacToeAI = require("../class/AI/TicTacToe/TicTacToeAI");

module.exports = {
    name: "simttt",
    description: "Command description",
    async execute(message, args) {
        const repo = ClassRepository;
        const manager = GameManager;

        const game = await manager.initiateGame("tictactoe");
        
        let tictactoeAI = await TicTacToeAI.load(123);

        if (!tictactoeAI) {
            tictactoeAI = repo.fetchClass("TicTacToeAI").build();

            tictactoeAI.setId(123);

            await tictactoeAI.save();
        }

        manager.addPlayerToGame(game, tictactoeAI);
        tictactoeAI.simulate();
        
        let otherAI = await TicTacToeAI.load(124);

        if (!otherAI) {
            otherAI = repo.fetchClass("TicTacToeAI").build();

            otherAI.setId(124);

            await otherAI.save();
        }

        manager.addPlayerToGame(game, otherAI);
        otherAI.simulate();

        manager.startGame(game);

        message.reply("Game started with ID: " + game.getId());
    }
};
