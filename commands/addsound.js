const FileWriter = require("../class/FileWriter");
const https = require("https");
const fs = require("fs");

module.exports = {
    name: "addsound",
    description: "Add a sound file to the bot.",
    adminOnly: true,
    execute(message, args) {
        let fileName = args[args.length-1];

        if (!fileName) {
            message.reply("Please enter a category, like so: `!mk addsound <category>`");
            return;
        }

        args.pop();

        let fileDir = "./sound/" + fileName;
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir);
        }

        if (!message.attachments.find(at => at)) {
            message.reply("Please attach a file to the message");
            return;
        }

        const sourceUrl = message.attachments.find(at => at).attachment;

        const fileCount = fs.readdirSync(fileDir).length+1;

        const file = fs.createWriteStream(fileDir + "/" + fileCount + ".mp3");
        const request = https.get(sourceUrl, function(response) {
            response.pipe(file);
        });
    }
};