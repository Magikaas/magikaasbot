const fs = require('fs');

class VoiceHandler {
    constructor() {}

    setChannel(channel) {
        this.channel = channel;
    }

    getChannel() {
        return this.channel;
    }

    setConnection(connection) {
        this.connection = connection;
    }

    getConnection() {
        return this.connection;
    }

    async connect(channel = null) {
        if (channel) {
            this.channel = channel;
        }

        const that = this;
        this.channel.join().then(connection => {
            that.connection = connection;
        });

        return true;
    }

    disconnect() {
        this.connection.disconnect();
    }

    playSound(sound) {
        // If we have a directory for a sound.
        const soundDir = "./sound/" + sound;
        let soundFile = "";

        if (fs.existsSync(soundDir)) {
            const files = fs.readdirSync(soundDir);
    
            const fileName = Math.floor(Math.random() * files.length) + 1;
    
            soundFile = soundDir + "/" + fileName + ".mp3";
        }
        else {
            soundFile = "./sound/" + sound + ".mp3";
        }
    
        if (!fs.existsSync(soundFile)) {
            console.log("Unable to play requested sound. " + soundFile);
        }
    
        if (this.isConnected()) {
            try {
                this.getConnection().play(soundFile);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    isConnected() {
        return !!this.connection;
    }
}

module.exports = {
    VoiceHandler
}