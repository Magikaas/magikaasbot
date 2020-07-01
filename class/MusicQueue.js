const Queue = require("./Queue");

class MusicQueue extends Queue.Queue {
    constructor() {
        super();
    }

    setVoiceHandler(voiceHandler) {
        this.voiceHandler = voiceHandler;
    }

    getVoiceHandler() {
        return this.voiceHandler;
    }
}

module.exports = {
    MusicQueue
}