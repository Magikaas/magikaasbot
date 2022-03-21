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

    async update() {
        if (!this.getGame()) {
            return;
        }

        if (!this.isItMyTurn()) {
            return;
        }

        // console.log("Update " + this.constructor.name, this.getId());

        const availableMoves = await this.getAvailableMoves();

        const pickedMove = this.pickRandomWeightedMove(availableMoves);

        if (!pickedMove) {
            return;
        }

        const moveObject = {
            square: pickedMove,
            game: this.getGame().getId(),
            player: this
        };

        if (moveObject) {
            this._manager.submitMove(moveObject);
        }

        this.save();
    }

    async getAvailableMoves() {
        const boardstate = await this.getBoardstate();
        return boardstate.getAvailableMoves();
    }
}

module.exports = TicTacToeAI;