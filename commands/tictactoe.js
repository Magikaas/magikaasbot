const TicTacToeBoard = require("../class/AI/TicTacToe/TicTacToeBoard");

module.exports = {
    name: "tictactoe",
    description: "Command description",
    async execute(message, args) {
        const board = new TicTacToeBoard();

        const wins = args.pop();

        board.simulate(wins);

        // board.postSimulationReport();
    }
};
