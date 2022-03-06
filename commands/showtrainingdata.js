module.exports = {
    name: "showtrainingdata",
    description: "Command description",
    async execute(message, args) {
        const trainingData = message.client.ai.trainingData;

        console.log(trainingData);
    }
};
