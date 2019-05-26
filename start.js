var publisher = require('./src/socket-io-push');
publisher.init(4000, 'test-topic');
var logger = require('./src/log-tail-service');
logger.start('c:\\HexLogs\\test.txt', 30, publisher.publish);
