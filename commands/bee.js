module.exports = {
    name: "bee",
    description: "Show entire .",
    help: "bee <beename>",
    excluded: true,
    execute(message, args) {
        const beeData = require('../data/bees.json');

        const requestedBee = args[0];

        let messageString = "\nRecipes:\n";

        const recipes = beeData[requestedBee];

        if (!recipes) {
            message.reply("No recipe found for this bee.");
            return;
        }

        for (let recipe of recipes) {
            messageString += recipe['princess'] + " + " + recipe['drone'] + "\n";
        }
        
        message.reply(messageString);
    }
};