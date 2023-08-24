class GuildQueueHandler {
    constructor() {
        this.queues = new Map();
    }

    addQueue(guildId, queue) {
        if (this.getQueue(guildId)) {
            console.log("A queue already exists for guild with id: " + guildId);
            return;
        }

        this.setQueue(guildId, queue);
    }

    setQueue(guildId, queue) {
        this.queues.set(guildId, queue);
    }

    getQueue(guildId) {
        return this.queues.get(guildId);
    }

    hasQueue(guildId) {
        return this.queues.has(guildId);
    }

    clearQueue(guildId) {
        const queue = this.queues.get(guildId);

        queue.clear();

        this.queues.set(guildId, queue);
    }

    queueIsEmpty(guildId) {
        const queue = this.queues.get(guildId);

        if (!queue) {
            return true;
        }

        return queue.isEmpty();
    }

    getQueueLength(guildId) {
        const queue = this.queues.get(guildId);

        if (!queue) {
            return 0;
        }

        return queue.length;
    }

    getQueueItem(guildId, index) {
        const queue = this.queues.get(guildId);

        if (!queue) {
            return null;
        }

        return queue.get(index);
    }

    isLooping(guildId) {
        const queue = this.queues.get(guildId);

        if (!queue) {
            return false;
        }

        return queue.isLooping();
    }
}

module.exports = GuildQueueHandler;