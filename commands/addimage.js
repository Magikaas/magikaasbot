const FileWriter = require("../class/FileWriter");

module.exports = {
    name: "addimage",
    description: "Command description",
    async execute(message, args) {
        let fileName = args.pop();

        let category = args.pop();

        const fileWriter = new FileWriter();
        if (category) {
            fileWriter.setCategory(category);
        }

        fileWriter.chooseFile(message.attachments.find(at => at).attachment);

        fileWriter.addImage(fileName);
    }
};
