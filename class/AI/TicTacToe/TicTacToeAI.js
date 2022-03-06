const AI = require("../Generic/AI");

const TICK_RATE = 2;

class TicTacToeAI extends AI {
    constructor() {
        super();
        this._tickLengthMs = 1000 / TICK_RATE;
        this._prev = Date.now();
        this._actualTicks = 0;
        this._weightedMoves = {};
        this._manager = require("../Generic/GameManager");
        this.load();
    }

    // Start
    simulate() {
        const now = Date.now();

        this._actualTicks++;
        if (this._prev + this._tickLengthMs <= now) {
            let delta = (now - this._prev) / 1000;
            this._prev = now;

            this.update(delta);

            // console.log('delta', delta, '(target: ' + this._tickLengthMs + ' ms)', 'node ticks', this._actualTicks);
            this._actualTicks = 0;
        }

        if (Date.now() - this._prev < this._tickLengthMs - 16) {
            setTimeout(this.simulate.bind(this));
        } else {
            setImmediate(this.simulate.bind(this));
        }
    }

    update() {
        if (!this.getGameId()) {
            return;
        }

        if (!this.isItMyTurn()) {
            return;
        }

        const weightedMoves = this.getAvailableMoves();

        const pickedMove = this.pickRandomWeightedMove(weightedMoves);

        if (!pickedMove) {
            console.log("Weighted moves", weightedMoves);
            console.log("Total weight", this.getTotalWeight(weightedMoves));
        }

        const moveObject = {
            square: pickedMove,
            game: this.getGameId(),
            player: this
        };

        if (moveObject) {
            this._manager.submitMove(moveObject);
        }

        this.save();
    }

    getAvailableMoves() {
        return this.getBoardstate().getAvailableMoves();
    }

    /**
     * 
     * @param {any} id 
     * @returns {TicTacToeAI}
     */
    static load(id) {
        const loader = super.load(id);

        loader.then(() => {

        });

        const ai = new TicTacToeAI();

        return ai;
    }

    save() {
    }
}

module.exports = TicTacToeAI;