const Player = require("./Player");
const ClassRepository = require("../ClassRepository");

class AI extends Player {
    constructor() {
        super();

        this._moveWeights = {};
    }

    /**
     * 
     * @returns {Boardstate}
     */
    async getBoardstate() {
        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");

        const game = await this.getGame();

        return await game.getBoardstate();
    }

    /**
     * Pick a random move out of a list of weighted items.
     *
     * @param {Object} list
     *   List of items, with a weight value to determine frequency.
     * @returns {Object}
     */
    pickRandomWeightedMove(list, side) {
        const randomRoll = Math.floor(Math.random() * this.getTotalWeight(list, side)) + 1;

        let weight = 0;
        // Loop through items, adding weights until its above the random roll and pick that item
        for (let i in list) {
            weight += list[i][side];

            if (weight > randomRoll) {
                return i;
            }
        }
    }

    /**
     * Get the total weight of a weighted list.
     *
     * @param {Object} list
     *   List of weighted items.
     * @returns {any}
     *   Total weight of list.
     */
    getTotalWeight(list, side) {
        let weight = 0;

        for (let i in list) {
            weight += list[i][side];
        }

        return weight;
    }

    /**
     * Check whether it is this AI's turn from the Manager
     * 
     * @returns {Boolean}
     */
    isItMyTurn() {
        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");
        
        return manager.checkIsTurn(this.getGame(), this);
    }

    updateMoveWeight(board, move, delta) {
        this._moveWeights[this.hash(board)][move.hash].weight += delta;
    }
}

module.exports = AI;