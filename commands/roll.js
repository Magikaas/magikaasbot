const DiceRoller = require("../class/DiceRoller");

module.exports = {
    name: "roll",
    description: "Roll dice",
    execute(message, args) {
        const diceRoller = new DiceRoller();

        const result = diceRoller.roll(args);

        let messageString = result.output;
        let messageParts = [];

        while (messageString.length > 2000) {
            let index = messageString.indexOf(",", 1900) + 2;

            messageParts.push(messageString.substring(0, index));

            messageString = messageString.substring(index);
        }

        if (messageParts.length > 0) {
            message.reply(result.result + " = ");
            
            for (let msg of messageParts) {
                message.reply("\n" + msg);
            }
        }
        else {

            message.reply(result.result + " = " + result.output);
        }
    }
};