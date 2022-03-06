const FileWriter = require("../class/FileWriter");

module.exports = {
    name: "addsound",
    description: "Add a sound file to the bot.",
    adminOnly: true,
    execute(message, args) {
        let fileName = args.pop();

        const fileWriter = new FileWriter();

        fileWriter.addSound(fileName);
    }
};