const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var SocketIoPublisher = (function () {
	var publishPort;
	var publishTopic;
	return {
		init: (port, topic) => {
			publishPort = typeof port === 'number' ? port : 3001;
			publishTopic = typeof topic === 'string' ? topic : 'log-tail-service-message';

			http.listen(publishPort, function () {
				console.log(`Socket IO publisher listening on *:${publishPort}`);
			});
		},
		publish: (message) => {
			io.emit(publishTopic, message);
		}
	};
})();

module.exports = SocketIoPublisher;
