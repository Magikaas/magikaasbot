const { DBGameType, DBGame } = require("../../../mysql/tables");
const ClassRepository = require("../ClassRepository");
const DBObject = require("./DB/DBObject");
const GAME_STATUS = require("./Globals");

class Game extends DBObject {
    static _dbObjectBase = DBGame;
    constructor() {
        super();
        this._players = {};
        this._type = {};
        this._gametype = {};
        this._boardstate = {};
        this._boardstateClass = "";
        this._currentTurnPlayer = {};
        this._status = GAME_STATUS.NEW;
        this._winner = {};
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

        boardstate.initiate();

        return boardstate;
    }

    async loadDefaultBoardstate() {
        const GameType = require("./GameType");
        const gametype = await GameType.loadByName(this.getType());

        const defaultBoardstateId = gametype.getDefaultBoardstateId();

        let boardstate = {};

        if (defaultBoardstateId === 0) {
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
        let dbData = {};
        try {
            dbData = await this._dbObjectBase.findOne({
                attributes: ['id', 'boardstateId', 'gametypeId'],
                where: {
                    id: id
                }
            });
        }
        catch (err) {
            console.log("Error", err);
            return null;
        }

        let game = {};

        if (dbData) {
            const GameType = require("./GameType");
            const gametype = await GameType.loadById(dbData.gametypeId);

            const boardstateClass = ClassRepository.fetchClass(gametype.getBoardstateClass());
    
            const boardstate = await boardstateClass.constructor.load(dbData.boardstateId);
    
            game = await ClassRepository.fetchClass(gametype.getGameClassname()).constructor.create();

            if (!game) {
                console.trace("No game found for", this.name, id);
            }

            if (boardstate) {
                game.setBoardstate(boardstate);
            }

            if(gametype) {
                game.setGametype(gametype);
            }
        }
        else {
            return null;
        }

        return game;
    }

    /**
     * 
     * @param {any} gameTypeId 
     * @returns {Game}
     */
    static async create(gameTypeId) {
        const game = super.create();

        await game.fixGametype();

        const gametype = await game.getGametype();
        
        game.setBoardstateClass(gametype.getBoardstateClass());

        game.save();

        return game;
    }

    async save() {
        // console.trace("Saving game", this);
        this._dbObject.gametypeId = this._gametype.getId();

        const boardstate = this.getBoardstate();

        if (boardstate && boardstate._id) {
            await boardstate.save();
            this._dbObject.boardstateId = boardstate.getId();
        }
        
        super.save();
    }
}

module.exports = Game;