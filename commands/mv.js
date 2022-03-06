module.exports = {
    name: "mv",
    description: "Command description",
    async execute(message, args) {
        const move = {
            data: args.shift()
        };
        const manager = require("../class/AI/Generic/GameManager");

        manager.submitMove(move);
    }
};
