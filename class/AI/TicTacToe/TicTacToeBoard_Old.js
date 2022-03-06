const hash = require("object-hash");

class TicTacToeBoardOld {
    constructor() {
        this._turn = "X";
        this._games = -1;
        this._totalgames = 0;
        this._finishedBoards = [];
        this._emptySpot = ' ';
        this._lastMove = [];
        this._winner = this._emptySpot;
        this._debug = false;
        this._brokenPercentages = [];
        this._availableMoves = {};
        this._availableMoveWeights = {};
        this._outcomes = {
            "X": 0,
            "O": 0,
            "tie": 0
        }
        this._boardStates = {};
        this.resetBoard();
    }

    resetBoard() {
        if (this.getBoard()) {
            this._finishedBoards.push({
                "board": this.getBoard(),
                "lastmove": this.getLastMove(),
                "winner": this.getWinner()
            });

            if (!this.getWinner()) {
                this.addOutcome("tie");
            }
            else {
                this.addOutcome(this.getWinner());
            }

            this._boardStates[this.hash(this.getBoard())] = this.getWinner() ? this.getWinner() : "tie";
        }
        this._board = [
            [this._emptySpot,this._emptySpot,this._emptySpot],
            [this._emptySpot,this._emptySpot,this._emptySpot],
            [this._emptySpot,this._emptySpot,this._emptySpot]
        ];
        this.setWinner(false);
        this._games++;

        this.updateGamePercentage();
        // this.resetAvailableMoves();

        return true;
    }

    resetAvailableMoves() {

        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                this._availableMoves[x][y] = true;
                this._availableMoveWeights[x][y] = 5;
            }
        }
        console.log(this._availableMoves);
    }

    getAvailableMoves() {
        return this._availableMoves;
    }

    removeAvailableMove(x, y) {
        this._availableMoves[x][y] = false;
    }

    getAvailableMoveWeight(x, y) {
        return this._availableMoveWeights[x][y];
    }

    addOutcome(outcome) {
        this._outcomes[outcome]++;
    }

    updateGamePercentage() {
        let percentage = 0;
        const brokenPercentages = this.getBrokenPercentages();

        if (this.brokePercentage(this.getTotalGames())) {
            percentage = Math.floor(this.getGames() / (this.getTotalGames()/100));
            brokenPercentages.push(percentage);
            this.getDebug() && console.log(percentage + "% done (" + this.getGames() + "/" + this.getTotalGames() + ")");
        }
    }

    getDebug() {
        return this._debug;
    }

    setDebug(debug) {
        this._debug = debug;
        return this;
    }

    getLastMove() {
        return this._lastMove;
    }

    setLastMove(x, y) {
        this._lastMove = [x, y, this.getTurn()];
        return this;
    }

    getWinner() {
        return this._winner;
    }

    setWinner(winner) {
        this._winner = winner;
        return this;
    }

    changeTurn() {
        this.setTurn(this.getTurn() == "X" ? "O" : "X");
        return this;
    }

    getTurn() {
        return this._turn;
    }

    setTurn(turn) {
        this._turn = turn;
        return this;
    }

    getBoard() {
        return this._board;
    }

    setBoard(board) {
        this._board = board;
        return this;
    }

    getFinishedBoards() {
        return this._finishedBoards;
    }

    getSpot(x, y) {
        return this.getBoard()[x][y];
    }

    isOccupied(x, y) {
        return this.getBoard()[x][y] !== this._emptySpot;
    }

    isBoardFull() {
        const board = this.getBoard();
        for (let x in board) {
            for (let y in board[x]) {
                if (!this.isOccupied(x, y)) {
                    return false;
                }
            }
        }
        return true;
    }

    checkWinner() {
        if (this.isBoardFull()) {
            this.setWinner(false);
            this.resetBoard();
        }
        for (let i of [0,1,2]) {
            //Horizontal & Vertical
            if (this.isOccupied(i,0) && this.getSpot(i,0) == this.getSpot(i,1) && this.getSpot(i,0) == this.getSpot(i,2)) {
                this.getDebug() && console.log(this.getSpot(i,0) + " has won!");
                this.setWinner(this.getSpot(i,0));
                this.resetBoard();
            }

            //Horizontal & Vertical
            if (this.isOccupied(0,i) && this.getSpot(0,i) == this.getSpot(1,i) && this.getSpot(0,i) == this.getSpot(2,i)) {
                this.getDebug() && console.log(this.getSpot(0,i) + " has won!");
                this.setWinner(this.getSpot(0,i));
                this.resetBoard();
            }
        }
        //Diagonal to bottomright
        if ((this.isOccupied(0,0) && this.getSpot(0,0) == this.getSpot(1,1) && this.getSpot(0,0) == this.getSpot(2,2))) {
            this.getDebug() && console.log(this.getSpot(0,0) + " has won!");
            this.setWinner(this.getSpot(0,0));
            this.resetBoard();
        }

        
        //Diagonal to topright
        if (this.isOccupied(0,2) && this.getSpot(0,2) == this.getSpot(1,1) && this.getSpot(0,2) == this.getSpot(2,0)) {
            this.getDebug() && console.log(this.getSpot(0,2) + " has won!");
            this.setWinner(this.getSpot(0,2));
            this.resetBoard();
        }
    }

    getTotalGames() {
        return this._totalgames;
    }

    setTotalGames(totalgames) {
        this._totalgames = totalgames;
        return this;
    }

    getGames() {
        return this._games;
    }

    getBrokenPercentages() {
        return this._brokenPercentages;
    }

    setBrokenPercentages(brokenPercentages) {
        this._brokenPercentages = brokenPercentages;
        return this;
    }

    brokePercentage(games) {
        const brokenPercentages = this.getBrokenPercentages();
        let percentage = (Math.floor(this.getGames() / (games/100)));
        if ((percentage % 10) == 0 && percentage > 0 && !brokenPercentages.includes(percentage)) {
            return true;
        }

        return false;
    }

    simulate(games = 1) {
        console.log("Start simulation of " + games + " games");
        this.setTotalGames(games);
        do {
            this.checkWinner();
            this.doRandomMove();
        } while (this.getGames() < games);
        console.log("Simulation ended");

    }

    postSimulationReport(message) {
        console.log("Boards: ");
        let c = 1;
        let lastmove;
        let board;
        for (let boardState of this.getFinishedBoards()) {
            lastmove = boardState.lastmove;
            board = boardState.board;
            // console.log("Board " + c++ + ":");
            // console.log(board[0]);
            // console.log(board[1]);
            // console.log(board[2]);

            // console.log("Last move: " + lastmove);
            // console.log("Winner: " + boardState.winner);
        }

        message.reply("Games played: " + this._games)
        console.log("Games played: " + this._games);
        
        message.reply("Outcome:");
        message.reply("X Wins: " + this._outcomes["X"]);
        message.reply("O Wins: " + this._outcomes["O"]);
        message.reply("Ties: " + this._outcomes["tie"]);
        // console.log("Outcome:");
        // console.log(this._outcomes);
        
        c = 0;

        for (let state in this._boardStates) {
            c++;
        }
        message.reply("Amount of different end boards: " + c);

        console.log("Different boardstates: " + c);
    }

    doMove(x, y) {
        //console.log("Put " + this.getTurn() + " on " + x + "," + y);
        this._board[x][y] = this.getTurn();
        this.setLastMove(x,y);
        this.changeTurn();
    }

    doRandomMove() {
        let x = -1;
        let y = -1;

        do {
            x = Math.floor(Math.random() * 3);
            y = Math.floor(Math.random() * 3);
        } while (this.isOccupied(x, y) && !this.isBoardFull());
    
        this.doMove(x, y);
    }

    doRandomWeightedMove() {

    }

    /**
     * Pick a random move out of a list of weighted items.
     *
     * @param list
     *   List of items, with a weight value to determine frequency.
     * @returns {any}
     */
    pickRandomWeightedMove() {
        const randomRoll = Math.floor(Math.random() * EmpireRandomiser.getTotalWeight(list)) + 1;

        let weight = 0;
        // Loop through items, adding weights until its above the random roll and pick that item
        for (let item of list) {
            weight += item;

            if (weight > randomRoll) {
                return item;
            }
        }
    }

    /**
     * Get the total weight of a weighted list.
     *
     * @param list
     *   List of weighted items.
     * @returns {number}
     *   Total weight of list.
     */
    getTotalWeight(list) {
        let weight = 0;

        for (let item of list) {
            weight += item;
        }

        return weight;
    }

    hash(value) {
        let hashValue = hash(value);

        return hashValue;
    }
}

module.exports = TicTacToeBoardOld;