const hash = require("object-hash");

class Manager {
    constructor() {}

    setBoardState(checksum, boardState) {
        Manager.boardStates[checksum] = boardState;
    }

    getBoardState(checksum) {
        return Manager.boardStates[checksum];
    }

    boardStateExists(checksum) {
        return typeof Manager.boardStates[checksum] != 'undefined';
    }
}

module.exports = Manager;