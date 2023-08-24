class QueueItem {
    // Basically a doubly-linked list

    constructor(prev, item, next) {
        this._prev = prev;
        this._item = item;
        this._next = next;
        this._islooping = false;
    }

    value() {
        return this._item;
    }

    prev() {
        return this._prev;
    }

    next() {
        return this._next;
    }

    setPrev(item) {
        this._prev = item;
    }

    setNext(item) {
        this._next = item;
    }

    hasNext() {
        return !!this.next();
    }

    hasPrev() {
        return !!this.prev();
    }

    delete() {
        this._item = null;
        // Basic doubly-linked list stuff, remove this item, link the surrounding items up
        this.prev.setNext(this.next);
        this.next.setPrev(this.prev);
    }

    setLooping(value) {
        this._islooping = value;
    }

    isLooping() {
        return this._item.isLooping();
    }
}

module.exports = QueueItem;