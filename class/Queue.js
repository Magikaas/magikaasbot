const QueueItem = require("./QueueItem");

class Queue {
    constructor() {
        this._current = null;
        this._first = null;
        this._last = null;
        this._len = 0;
    }

    prev() {
        if (!this.current()) {
            // There is no current item, so there are no items in the queue
            return false;
        }

        if (!this.current().prev()) {
            // No previous item, this is the start of the queue
            return false;
        }

        this._current = this.current().prev();
    }

    next() {
        if (!this.current) {
            // There is no current item, so there are no items in the queue
            return false;
        }

        if (!this.current().next()) {
            // No next item, this is the end of the queue
            return false;
        }

        this._current = this.current().next();
    }

    current() {
        return this._current;
    }

    clear() {
        this.removePrevAndNextRecursive(this.current());
        this._first = null;
        this._last = null;
    }

    removePrevAndNextRecursive(item) {
        if(item.next()) {
            this.removePrevAndNextRecursive(item.next());
            item.setNext(null);
        }

        if(item.prev()) {
            this.removePrevAndNextRecursive(this.prev());
            item.setPrev(null);
        }

        item = null;
    }

    // Add an item to the end of the queue
    push(value) {
        let item = new QueueItem.QueueItem(this.last(), value, null);
        if (!this.current()) {
            // This is the first item in the queue now
            this._first = item;
            this._current = item;
            this._last = item;
        }
        else {
            // If we already have items, we assume we have a lastItem and add this onto it
            this.last().setNext(item);
            this._last = item;
        }

        this._len++;
    }

    // Remove the last item from the queue
    pop() {
        let item = this.last();

        this.last().prev().setNext(null);
        this._last = this.last().prev();

        this._len--;

        return item;
    }

    // Add an item to the start of the queue
    unshift(value) {
        const item = new QueueItem(null, value, this.first());
        if (!this.current()) {
            // This is the first item in the queue now
            this._current = item;
            this._first = item;
        }
        else {
            this.first().setPrev(item);
            this._first = item;
        }
        this._len++;
    }

    // Remove the first item from the queue
    shift() {
        let item = this.first();

        this.first().next().setPrev(null);
        this._first = this.first().next();

        this._len--;

        return item;
    }

    first() {
        return this._first;
    }

    last() {
        return this._last;
    }

    getLength() {
        return this._len;
    }

    reset() {
        this._current = this.first();
    }
}

module.exports = Queue;