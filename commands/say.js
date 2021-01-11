const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

module.exports = {
    name: "say",
    voice: true,
    description: "Play text as voiced audio",
    async execute(message, args) {
        const text = args.join(" ");
        message.reply("You said '" + text + "'");

        const outputFile = "voice.mp3";

        const client = new textToSpeech.TextToSpeechClient();

        const request = {
            input: {text: text},
            voice: {languageCode: 'es-Es', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
          };
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(outputFile, response.audioContent, 'binary');
        console.log(`Audio content written to file: ${outputFile}`);
        message.client.getVoiceHandler(message.guild.id).playSoundFile(outputFile);
    }
};
