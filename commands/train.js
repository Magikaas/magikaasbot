module.exports = {
    name: "train",
    description: "Train the AI with previously prepared training data",
    async execute(message, args) {
        await message.reply("Started training");

        const trainingResult = message.client.train((error) => { message.reply("Training... Error margin: " + error.error + ". Progress: " + error.iterations); });

        message.reply("Trained!");
    }
};
