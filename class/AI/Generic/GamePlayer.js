const { DBGamePlayer } = require("../../../mysql/tables");
const ClassRepository = require("../ClassRepository");
const DBObject = require("./DB/DBObject");

class GamePlayer extends DBObject {
    static _dbObjectBase = DBGamePlayer;
    constructor() {
        super();
        this._game = {};
        this._player = {};
        this._side = null;
    }

    /**
     * @param {String} side 
     * @returns {GamePlayer}
     */
    setSide(side) {
        console.trace("Set side", side, "for gameplayer", this.getPlayer().getId());
        this._side = side;
        return this;
    }

    getSide() {
        return this._side;
    }

    /**
     * 
     * @param {Player} player 
     * @returns {GamePlayer}
     */
    setPlayer(player) {
        this._dbObject.playerId = player.getId();
        this._player = player;
        return this;
    }

    /**
     * 
     * @returns {Player}
     */
    getPlayer() {
        return this._player;
    }

    /**
     * 
     * @param {Game} game 
     * @returns {GamePlayer}
     */
    setGame(game) {
        this._dbObject.gameId = game.getId();
        this._game = game;
        return this;
    }

    /**
     * 
     * @returns {Game}
     */
    getGame() {
        return this._game;
    }

    /**
     * 
     * @param {Integer} id 
     * @returns {GamePlayer}
     */
    static async load(id) {
        const data = await this._dbObjectBase.findOne({
            attributes: ['id', 'gameId', 'playerId'],
            where: {
                id: id
            }
        });

        if (!data) {
            return null;
        }

        const className = this.name;
    
        let gameplayer = ClassRepository.fetchClass(className);

        gameplayer.setSide(data.side);

        return gameplayer;
    }

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @returns {GamePlayer}
     */
    static async loadByData(game, player) {
        let dbData = null;
        try {
            dbData = await this._dbObjectBase.findOne({
                attributes: ['id', 'side', 'gameId', 'playerId'],
                where: {
                    gameId: game.getId(),
                    playerId: player.getId()
                }
            });
        }
        catch(err) {
            console.log("Error while loading gameplayer by data", [game, player], err);
        }

        if (!dbData) {
            return null;
        }

        let gameplayer = this.create();
        
        gameplayer = this.create();

        gameplayer.setPlayer(player);
        gameplayer.setGame(game);
        gameplayer.setSide(dbData.side);

        return gameplayer;
    }

    async save() {
        this._dbObject.playerId = this.getPlayer().getId();
        this._dbObject.gameId = this.getGame().getId();
        this._dbObject.side = this.getSide();

        super.save();
    }

    /**
     * 
     * @param {Object} data 
     * @returns {GamePlayer}
     */
    static create() {
        let gameplayer = super.create();

        return gameplayer;
    }
}

module.exports = GamePlayer;