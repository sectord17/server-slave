const {getValidEnv, include} = require('./utils');

global.include = include;

const GameManager = require('./game-manager');
const MasterSDK = require('./sdk/master-sdk');
const ServerHTTP = require('./server-http');

let masterUrl = getValidEnv('MASTER_URL');
let masterToken = getValidEnv('MASTER_TOKEN');
let gamePath = getValidEnv('GAME_PATH');
let gameIp = getValidEnv('GAME_IP');
let gameToken = getValidEnv('GAME_TOKEN');
let port = getValidEnv('PORT');

const masterSDK = new MasterSDK(masterUrl, masterToken);
const gameManager = new GameManager(masterSDK, gamePath, gameIp, gameToken);
const serverHTTP = new ServerHTTP(port);

module.exports = {
    masterSDK,
    gameManager,
    serverHTTP
};

require('./cli');
serverHTTP.start();
