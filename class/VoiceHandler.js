const fs = require('fs');
const MusicQueue = require('./MusicQueue');

class VoiceHandler {
    constructor(client) {
        this._client = client;
    }

    setQueueHandler(queueHandler) {
        this._queueHandler = queueHandler;
    }

    getQueueHandler() {
        return this._queueHandler;
    }

    endPlaying() {
        const connection = this.getConnection();

        if (connection) {
            connection.dispatcher.end();
        }
    }

    syncVoiceChannel() {
        let channel = this.getCurrentVoiceChannel();

        this._channel = channel;
    }

    isInVoice() {
        return !!this.getCurrentVoiceChannel();
    }

    getCurrentVoiceChannel() {
        return this._client.channels.cache.find(channel => channel.type === "voice" && channel.members.find(member => member.id === this._client.user.id));
    }

    setChannel(channel) {
        this._channel = channel;
    }

    getChannel() {
        return this._channel;
    }

    setConnection(connection) {
        this._connection = connection;
    }

    getConnection() {
        return this._connection;
    }

    async connect() {
        return this._channel.join();
    }

    disconnect() {
        this._connection.disconnect();
        this._connection = null;
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
            return false;
        }
        
        this.play(soundFile);
    }

    playYT(youtubeURL) {
        this.play(youtubeURL);
    }

    play(source) {
        if (this.isConnected()) {
            try {
                return this.getConnection().play(source);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    startQueue(guildId) {
        this._queueHandler.start(guildId);
    }

    isConnected() {
        return !!this._connection;
    }
}

module.exports = {
    VoiceHandler
}