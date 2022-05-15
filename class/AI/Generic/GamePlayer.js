const { DBGamePlayer } = require("../../../mysql/tables");
const DBObject = require("./DB/DBObject");

class GamePlayer extends DBObject {
    static _dbObjectBase = DBGamePlayer;
    constructor() {
        super();
        this._game = null;
        this._player = null;
        this._side = null;
    }

    /**
     * @param {String} side 
     * @returns {GamePlayer}
     */
    setSide(side) {
        this._side = side;
        return this;
    }

    getSide() {
        return this._side;
    }

    /**
     * 
     * @param {Integer} id 
     * @returns {GamePlayer}
     */
    static async load(id) {
        const [dbModel, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'gameId', 'playerId'],
            where: {
                id: id
            }
        });

        if (created) {
            return null;
        }
    
        let gameplayer = this.constructor.build();
        gameplayer._dbObject = dbModel;

        gameplayer.setSide(data.side);
        gameplayer.setId(id);

        return gameplayer;
    }

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @returns {GamePlayer}
     */
    static async loadByData(game, player) {
        const [dbModel, created] = await this._dbObjectBase.findOrBuild({
            attributes: ['id', 'side', 'gameId', 'playerId'],
            where: {
                gameId: game.getId(),
                playerId: player.getId()
            }
        });

        if (created) {
            return null;
        }

        let gameplayer = this.build();
        gameplayer._dbObject = dbModel;

        gameplayer.setPlayer(player);
        gameplayer.setGame(game);
        gameplayer.setSide(dbModel.side);

        return gameplayer;
    }

    async save() {
        this._dbObject.playerId = this.getPlayer().getId();
        this._dbObject.gameId = this.getGame().getId();
        this._dbObject.side = this.getSide();

        await super.save();
    }

    /**
     * 
     * @param {Object} data 
     * @returns {GamePlayer}
     */
    static build() {
        let gameplayer = super.build();

        return gameplayer;
    }
}

module.exports = GamePlayer;