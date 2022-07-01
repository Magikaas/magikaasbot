const { DBGameType, DBGame } = require("../../../mysql/tables");
const ClassRepository = require("../ClassRepository");
const DBObject = require("./DB/DBObject");
const GAME_STATUS = require("./Globals");

class Game extends DBObject {
    static _dbObjectBase = DBGame;
    constructor() {
        super();
        this._players = {};
        this._type = null;
        this._gametype = null;
        this._boardstate = null;
        this._boardstateClass = "";
        this._currentTurnPlayer = null;
        this._status = GAME_STATUS.NEW;
        this._data = {};
        this._objectType = "generic";
    }

    async fixGametype() {
        const GameType = require("./GameType");
        const gametype = await GameType.loadByName(this.getType());
        this.setGametype(gametype);
    }

    /**
     * 
     * @param {Player} player 
     * @returns {GamePlayer}
     */
    async addPlayer(player) {
        super.addPlayer(player);

        const GamePlayer = require("./GamePlayer");

        let gameplayer = await GamePlayer.loadByData(this, player);

        if (!gameplayer) {
            gameplayer = GamePlayer.build();
            gameplayer.setPlayer(player);
            gameplayer.setGame(this);
        }
        
        return gameplayer;
    }

    /**
     * 
     * @param {Player} player 
     * @returns 
     */
    removePlayer(player) {
        if (this._players[player.getId()]) {
            this._players[player.getId()] = null;
        }
        return this;
    }

    setData(data) {
        this._data = data;
        return this;
    }

    getData() {
        return this._data;
    }

    /**
     * 
     * @param {String} type 
     * @returns {Object}
     */
    setType(type) {
        this._type = type;
        return this;
    }

    /**
     * 
     * @returns {String}
     */
    getType() {
        return this._type;
    }

    initiateBoardstate() {
        const boardstate = this.getRepo().fetchClass(this.getBoardstateClass()).constructor.build();

        boardstate.setSides(this._sides);

        boardstate.initiate();

        return boardstate;
    }

    async loadDefaultBoardstate() {
        const GameType = require("./GameType");
        const gametype = await GameType.loadByName(this.getType());

        const defaultBoardstateId = gametype.getDefaultBoardstateId();

        let boardstate = {};

        if (!defaultBoardstateId) {
            boardstate = this.initiateBoardstate();
        }
        else {
            const Boardstate = require("./Boardstate");
            boardstate = await Boardstate.load(defaultBoardstateId);
        }

        return boardstate;
    }

    setBoardstateClass(boardstateClass) {
        this._boardstateClass = boardstateClass;
        return this;
    }

    getBoardstateClass() {
        return this._boardstateClass;
    }

    getCurrentTurnPlayer() {
        return this._currentTurnPlayer;
    }

    setPlayerTurn(player) {
        if (!player) {
            console.trace("No player set for turn", this);
        }
        this._currentTurnPlayer = player;
        return this;
    }

    getRandomPlayer() {
        const players = this._players;

        let count = 0;
        for (let p in players) {
            count++;
        }

        const random = Math.floor(Math.random() * count);

        let c = 0;
        for (let p in players) {
            if (c == random) {
                return players[p];
            }
            c++;
        }

        return null;
    }

    startGame() {
        const player = this.getRandomPlayer();
        this._currentTurnPlayer = player;
    }

    hasStarted() {
        return this.getStatus() === GAME_STATUS.STARTED;
    }

    checkIfWon() {
        return this.getStatus() === GAME_STATUS.WON;
    }

    setWinner(winner) {
        this._data.winner = winner;
        return this;
    }

    getWinner() {
        return this._data.winner;
    }

    hasWinner() {
        return this._data.winner != null;
    }

    handleMove(move) {
        throw new Error("Can not handle move on generic Game class");
    }

    static async load(id) {
        const [dbModel, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'data', 'boardstateId', 'gametypeId'],
            where: {
                id: id
            }
        });

        let game = {};

        if (created) {
            return null;
        }
        
        const GameType = require("./GameType");
        const gametype = await GameType.loadById(dbModel.gametypeId);

        const boardstateClass = ClassRepository.fetchClass(gametype.getBoardstateClass());

        const boardstate = await boardstateClass.constructor.load(dbModel.boardstateId);

        game = await ClassRepository.fetchClass(gametype.getGameClassname()).constructor.build();

        if (!game) {
            console.trace("No game found for", this.name, id);
        }

        game.setId(id);
        game._dbObject.isNewRecord = false;

        if (boardstate) {
            game.setBoardstate(boardstate);
        }

        if(gametype) {
            game.setGametype(gametype);
        }

        game.setData(JSON.parse(dbModel.data));

        return game;
    }

    /**
     * 
     * @param {any} gameTypeId 
     * @returns {Game}
     */
    static async build() {
        const game = super.build();

        await game.fixGametype();

        const gametype = await game.getGametype();
        
        game.setBoardstateClass(gametype.getBoardstateClass());

        return game;
    }

    async save() {
        const oldId = this.getId();
        // console.trace("Saving game", this);
        this._dbObject.gametypeId = this._gametype.getId();
        this._dbObject.data = JSON.stringify(this.getData());

        const boardstate = this.getBoardstate();

        if (boardstate) {
            await boardstate.save(true);

            this._dbObject.boardstateId = boardstate.getId();
        }
        
        await super.save();
    }
}

module.exports = Game;