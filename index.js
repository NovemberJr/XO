var server = require('./server');
var router = require('./router');
var handlers = require('./handlers');

var handle = {};
handle['/update'] = handlers.update;
handle['/restart'] = handlers.restart;
handle['/makeMove'] = handlers.makeMove;

var noughtsTurn = false;
var playersTurn;
player = {};
gameField = [];
for (i = 0; i < 9; i++) gameField[i] = "";

server.start(router.route, handle);
