module.exports = {
    name: "showtrainingdata",
    description: "Command description",
    async execute(message, args) {
        if (!message.client.ai.trainingData || message.client.ai.trainingData.length === 0) {
            message.reply("No training data");
            return;
        }

        message.client.dumpNeuralNetwork();

        message.client.ai.trainingData.forEach((record) => {
            console.log(record);
        }
        );
    }
};
