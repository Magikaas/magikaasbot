const TicTacToeAI = require("../class/AI/TicTacToe/TicTacToeAI");
const TicTacToeBoardOld = require("../class/AI/TicTacToe/TicTacToeBoard_Old");

module.exports = {
    name: "sim",
    description: "Command description",
    async execute(message, args) {
        const tttAI = new TicTacToeBoardOld();

        tttAI.simulate(args.shift());
        tttAI.postSimulationReport(message);
    }
};
