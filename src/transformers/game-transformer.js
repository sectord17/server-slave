/**
 * @param {Game} game
 */
module.exports = game => {
    return {
        id: game.id,
        name: game.name,
        ip: game.ip,
        port: game.gamePort,
        players_count: game.playersCount,
        status: game.status,
    };
};