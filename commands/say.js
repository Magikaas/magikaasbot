const textToSpeech = require('@google-cloud/text-to-speech');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('util');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('say')
            .setDescription('Play text as voiced audio')
            .addStringOption(option =>
                option.setName('text')
                    .setDescription('The text you want to play.')
                    .setRequired(true)
            ),
    name: "say",
    voice: true,
    description: "Play text as voiced audio",
    cooldown: 5,
    active: true,
    async execute(message, args) {
        let gender = message.client.tts.gender;
        let language = message.client.tts.language;

        const paramRegex = /(?<variable>.+)=(?<value>.+)/;

        let b = [];
        for (let i in args) {
            let param = args[i];
            let check = paramRegex.exec(param);

            if (check != null) {
                let variable = check.groups.variable;
                let value = check.groups.value;

                console.log(check);

                console.log("Var: " + variable);
                console.log("Val: " + value);

                switch (variable) {
                    case "g":
                    case "gender":
                        gender = value;
                        break;
                    case "l":
                    case "language":
                        language = value;
                        break;
                }

                args[i] = "";
            }
        }

        const text = args.join(" ");
        message.reply("You said '" + text + "'");

        const fileDir = "./voice/";
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir);
        }

        const fileCount = fs.readdirSync(fileDir).length+1;

        const outputFile = fileDir + fileCount + ".mp3";

        const client = new textToSpeech.TextToSpeechClient();

        const request = {
            input: {text: text},
            voice: {languageCode: language, ssmlGender: gender},
            audioConfig: {audioEncoding: 'MP3'},
          };
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(outputFile, response.audioContent, 'binary');
        console.log(`Audio content written to file: ${outputFile}`);
        message.client.getVoiceHandler(message.guild.id).playAudioFile(outputFile);
    }
};
