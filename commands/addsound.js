const https = require("https");
const fs = require("fs");

module.exports = {
    name: "addsound",
    description: "Add a sound file to the bot.",
    execute(message, args) {
        let fileName = args.pop();

        let fileDir = "./sound/" + fileName;
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir);
        }

        const sourceUrl = message.attachments.find(at => at).attachment;

        const fileCount = fs.readdirSync(fileDir).length+1;

        const file = fs.createWriteStream(fileDir + "/" + fileCount + ".mp3");
        const request = https.get(sourceUrl, function(response) {
            response.pipe(file);
        });
    }
};