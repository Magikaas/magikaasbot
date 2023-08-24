const Queue = require("./Queue.js");

class MusicQueue extends Queue {
    constructor() {
        super();
    }

    addSoundFile(soundFile) {
        this.push(soundFile);
    }

    addLoopingSoundFile(soundFile) {
        this.push(soundFile);
        this.last().setLooping(true);
    }

    isLooping() {
        return this.current() && this.current().isLooping();
    }
}

module.exports = MusicQueue;