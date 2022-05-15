const GameManager = require("../class/AI/Generic/GameManager");

module.exports = {
    name: "validate",
    description: "Command description",
    async execute(message, args) {
        const gameId = args.pop();
        const manager = GameManager;
        if (gameId) {
            await manager.validateTurns(gameId);
        }
        else {
            await manager.validateTurns();
        }
    }
};
