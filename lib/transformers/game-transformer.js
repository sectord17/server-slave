/**
 * @param {Game} game
 */
module.exports = game => {
    return {
        id: game.id,
        players_count: game.playersCount,
    };
};