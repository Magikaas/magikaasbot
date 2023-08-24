const fs = require('fs');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: "record",
    description: "Command description",
    voice: true,
    async execute(message, args) {
        const connection = getVoiceConnection(message.guild.id);

        // Set the filename for the audio file.
        let filename = `./resources/audio.raw`;

        // Create a write stream for the audio file.
        const file = fs.createWriteStream(filename);

        // Create a new Discord receiver.
        const receiver = connection.receiver;

        const stream = receiver.subscribe(message.author.id);

        stream.on('error', console.error);

        stream.on('data', (chunk) => {
            file.write(chunk);
        });

        stream.on('end', () => {
            console.log('done');
        });

        // Stop recording after 10 seconds
        setTimeout(() => {
            stream.destroy();
            file.end();
            console.log('stopped recording');

            // Send the audio file to the channel.
            message.channel.send({
                files: [{
                    attachment: filename,
                    name: 'audio.raw'
                }]
            });

            filename = "sound/3.mp3";

            // Play the audio file in the voice channel.
            message.client.getVoiceHandler(message.guild.id).playAudioFile(filename);
        }, 10000);
    }
};
