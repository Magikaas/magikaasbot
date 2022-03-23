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
        this._winner = null;
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
        this._players[player.getId()] = player;

        const GamePlayer = require("./GamePlayer");

        let gameplayer = await GamePlayer.loadByData(this, player);

        if (!gameplayer) {
            gameplayer = GamePlayer.create();
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

    /**
     * 
     * @param Integer id 
     * @returns {Player}
     */
    getPlayer(id) {
        return this._players[id];
    }

    getPlayers() {
        return this._players;
    }

    /**
     * 
     * @param {GameType} gametype 
     */
    setGametype(gametype) {
        this._gametype = gametype;
        return this;
    }

    getGametype() {
        return this._gametype;
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

    /**
     * Set this game's board data
     * 
     * @param {Boardstate} boardstate 
     * @returns {Game}
     */
    setBoardstate(boardstate) {
        // console.trace("Setting boardstate", boardstate);
        this._boardstate = boardstate;
        return this;
    }

    /**
     * Fetch this game's board
     * 
     * @returns {Boardstate}
     */
    getBoardstate() {
        return this._boardstate;
    }

    initiateBoardstate() {
        const boardstate = this.getRepo().fetchClass(this.getBoardstateClass()).constructor.create();

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

    getClass() {
        return this.class
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

    checkIfWon() {
        return this.getStatus() === GAME_STATUS.WON;
    }

    setWinner(winner) {
        this._winner = winner;
        return this;
    }

    getWinner() {
        return this._winner;
    }

    hasWinner() {
        return this._winner != null;
    }

    handleMove(move) {
        throw new Error("Can not handle move on generic Game class");
    }

    static async load(id) {
        const [dbData, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'boardstateId', 'gametypeId'],
            where: {
                id: id
            }
        });

        let game = {};

        if (created) {
            return null;
        }
        
        const GameType = require("./GameType");
        const gametype = await GameType.loadById(dbData.gametypeId);

        const boardstateClass = ClassRepository.fetchClass(gametype.getBoardstateClass());

        const boardstate = await boardstateClass.constructor.load(dbData.boardstateId);

        game = await ClassRepository.fetchClass(gametype.getGameClassname()).constructor.create();

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

        return game;
    }

    /**
     * 
     * @param {any} gameTypeId 
     * @returns {Game}
     */
    static async create() {
        const game = super.create();

        await game.fixGametype();

        const gametype = await game.getGametype();
        
        game.setBoardstateClass(gametype.getBoardstateClass());

        return game;
    }

    async save() {
        const oldId = this.getId();
        // console.trace("Saving game", this);
        this._dbObject.gametypeId = this._gametype.getId();

        const boardstate = this.getBoardstate();

        if (boardstate) {
            await boardstate.save(true);

            this._dbObject.boardstateId = boardstate.getId();
        }
        
        await super.save();
    }
}

module.exports = Game;