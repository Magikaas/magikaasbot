const QueueItem = require("./QueueItem");

class YoutubeQueueItem extends QueueItem.QueueItem {
    url() {
        return this._item.url;
    }
}