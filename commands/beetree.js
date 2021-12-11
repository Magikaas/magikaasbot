module.exports = {
    name: "beetree",
    description: "Show entire breeding tree for bees.",
    help: "bee <beename>",
    excluded: true,
    execute(message, args) {
        const beeData = require('../data/bees.json');

        const requestedBee = args[0];

        let step = 0;

        let messageString = "\nRecipe:\n";

        recursiveBeeCalculate = function(bee) {
            const beeRecipes = beeData[bee];

            if (typeof beeRecipes === "undefined") {
                message.reply("Bee: " + bee + " has no recipe");
                return {};
            }

            const beeRecipe = beeRecipes[0];

            let result = {};

            let princess = false;
            let drone = false;

            let indentCurr = "";

            for (let i = 0; i < step; i++) {
                indentCurr += " -";
            }

            let indentRecipe = "";

            for (let i = 0; i < step; i++) {
                indentRecipe += " -";
            }
            
            messageString += indentCurr + " " + bee + "\n";

            step++;

            if (beeRecipe) {
                princess = beeRecipe['princess'];
                drone = beeRecipe['drone'];

                result[princess] = recursiveBeeCalculate(princess);
                result[drone] = recursiveBeeCalculate(drone);
            }

            step--;

            return result;
        }

        const fullRecipeTree = recursiveBeeCalculate(requestedBee);

        recursiveRecipePrinter = function(recipeTree) {
            
        }

        var recipe = [];
        for (var bee in fullRecipeTree) {
            recipe = fullRecipeTree
        }

        console.log(fullRecipeTree);

        let messageParts = [];

        while (messageString.length > 2000) {
            let index = messageString.indexOf("\n", 1900) + 2;

            messageParts.push(messageString.substring(0, index));

            messageString = messageString.substring(index);
        }

        messageParts.push(messageString);

        if (messageParts.length > 0) {
            for (let msg of messageParts) {
                // message.reply("\n" + msg);
            }
        }
        else {
            message.reply(messageString);
        }
    }
};