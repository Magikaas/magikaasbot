// const TicTacToeAI = require("../class/AI/TicTacToe/TicTacToeAI");
// const TicTacToeBoardOld = require("../class/AI/TicTacToe/TicTacToeBoard_Old");
const ClassRepository = require("../class/AI/ClassRepository");
const GameManager = require("../class/AI/Generic/GameManager");
const TicTacToeAI = require("../class/AI/TicTacToe/TicTacToeAI");

module.exports = {
    name: "sim",
    description: "Command description",
    async execute(message, args) {
        // const tttAI = new TicTacToeBoardOld();

        // tttAI.simulate(args.shift());
        // tttAI.postSimulationReport(message);

        const repo = ClassRepository;
        const manager = GameManager;

        const gameCount = args.pop() * 1;

        let games = [];

        message.reply("Starting " + gameCount + " games");
        
        for (let i = 0; i < gameCount; i++) {
            const game = await manager.initiateGame("tictactoe");
            
            let tictactoeAI = await TicTacToeAI.load(123);
    
            if (!tictactoeAI) {
                tictactoeAI = repo.fetchClass("TicTacToeAI").create();
    
                tictactoeAI.setId(123);
    
                await tictactoeAI.save();
            }
    
            manager.addPlayerToGame(game, tictactoeAI);
            tictactoeAI.simulate();
            
            let otherAI = await TicTacToeAI.load(124);
    
            if (!otherAI) {
                otherAI = repo.fetchClass("TicTacToeAI").create();
    
                otherAI.setId(124);
    
                await otherAI.save();
            }
    
            manager.addPlayerToGame(game, otherAI);
            otherAI.simulate();
    
            manager.startGame(game);

            games.push(game.getId());
    
            // message.reply("Game started with ID: " + game.getId());
        }

        message.reply("Starting games " + games.join(", "));
    }
};
