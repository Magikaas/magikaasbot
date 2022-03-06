const GameManager = require("./GameManager");
const Tables = require('../../../mysql/tables');
const Player = require("./Player");
const ClassRepository = require("../ClassRepository");
const Board = require("./Board");

class AI extends Player {
    constructor() {
        super();

        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");
        manager.registerPlayer(this);

        this._moveWeights = {};
    }

    /**
     * 
     * @returns {Board}
     */
    getBoardstate() {
        const repo = ClassRepository;
        const manager = repo.fetchClass("GameManager");

        const game = manager.getGame(this.getGameId());

        return game.getBoardstate();
    }

    /**
     * Pick a random move out of a list of weighted items.
     *
     * @param {Object} list
     *   List of items, with a weight value to determine frequency.
     * @returns {Object}
     */
    pickRandomWeightedMove(list) {
        const randomRoll = Math.floor(Math.random() * this.getTotalWeight(list)) + 1;

        let weight = 0;
        // Loop through items, adding weights until its above the random roll and pick that item
        for (let i in list) {
            weight += list[i];

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
    getTotalWeight(list) {
        let weight = 0;

        for (let i in list) {
            weight += list[i];
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
        
        return manager.checkIsTurn(this.getGameId(), this);
    }

    /**
     * Load this AI's data from the database
     * 
     * @param {any} id 
     * @returns {Obj}
     */
    load(id) {
        return;
        const data = Tables.Player.findAll({
            attributes: ['id', 'data'],
            where: {'id': id}
        });
        
        return data;
    }

    updateMoveWeight(board, move, delta) {
        this._moveWeights[this.hash(board)][move.hash].weight += delta;
    }
}

module.exports = AI;