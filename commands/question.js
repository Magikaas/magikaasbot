module.exports = {
    name: "question",
    description: "Ask the AI a question",
    async execute(message, args) {
        const result = message.client.runNet({
            [args[0]]: 1
        });

        let replyText = "Outcome:\n";

        let probability = 0;

        for (let r in result) {
            const className = r;

            probability = result[r];

            console.log("Class: " + className);
            console.log("Probability: " + probability);
            console.log("Errormargin: " + message.client.ai.errorMargin);

            if (probability > message.client.ai.errorMargin) {
                replyText += className + "\t" + parseInt(probability*100) + "\n";
            }
        }

        message.reply(replyText);
    }
};
