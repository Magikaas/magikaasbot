const hash = require("object-hash");

class Manager {
    constructor() {}

    setBoardState(checksum, boardstate) {
        Manager.boardStates[checksum] = boardstate;
    }

    getBoardState(checksum) {
        return Manager.boardStates[checksum];
    }

    boardStateExists(checksum) {
        return typeof Manager.boardStates[checksum] != 'undefined';
    }
}

module.exports = Manager;