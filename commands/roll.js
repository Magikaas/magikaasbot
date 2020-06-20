const DiceRoller = require("../class/DiceRoller");

module.exports = {
    name: "roll",
    description: "Roll dice",
    execute(message, args) {
        const diceRoller = new DiceRoller.DiceRoller();

        const result = diceRoller.roll(args);

        message.reply(result.result + " = " + result.output);
    }
};