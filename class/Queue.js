const QueueItem = require("./QueueItem.js");

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
            return;
        }

        if (!this.current().hasPrev()) {
            // No previous item, this is the start of the queue
            return;
        }

        this._current = this.current().prev();
    }

    next() {
        if (!this.current()) {
            // There is no current item, so there are no items in the queue
            return;
        }

        if (!this.current().hasNext()) {
            // No next item, this is the end of the queue
            return;
        }

        this._current = this.current().next();
    }

    get(index) {
        if (index < 0 || index >= this.length) {
            return;
        }

        let item = this.first();

        for (let i = 0; i < index; i++) {
            item = item.next();
        }

        return item;
    }

    current() {
        return this._current;
    }

    currentValue() {
        if (!this.current()) {
            return;
        }
        return this.current().value();
    }

    hasNext() {
        if (!this.current()) {
            return false;
        }
        return this.current().hasNext();
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
        const item = new QueueItem(this.last(), value, null);
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
        const item = this.first();

        this.first().next().setPrev(null);
        this._first = this.first().next();

        this._len--;

        return item;
    }

    resetPointer() {
        this._current = this.first();
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

    isEmpty() {
        return this.getLength() == 0;
    }
}

module.exports = Queue;