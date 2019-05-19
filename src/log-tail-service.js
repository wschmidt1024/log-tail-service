const fs = require('fs');
const os = require('os');
const path = require('path');
const chokidar = require('chokidar');
const Tail = require('always-tail');

var LogTailService = (function () {
	function watchForFileCreation(file, timeout) {
		console.log(`File '${file}' does not exist. Waiting for it to be created...`);
		const watcher = chokidar.watch(file, {
			ignored: /(^|[\/\\])\../,
			persistent: true
		});
		var timer = setTimeout(() => {
			console.log(`File '${file}' has not been created and this service will no longer watch for its creation.`);
			watcher.close();
		}, timeout * 1000);
		watcher.on('add', watchedFile => {
			clearTimeout(timer);
			tailFile(watchedFile)
		});
	}

	function tailFile(file) {
		var tail = new Tail(file, os.EOL, {
			interval: 100
		});
		tail.on('line', function (data) {
			console.log(data);
			//TODO: publish data for any subscribers
		});
		tail.on('error', function (data) {
			console.error("error:", data);
		});
		console.log(`Tailing log file: '${file}'`);
	}

	return {
		start: function (file, timeout) {
			if (!file) {
				console.error('Unable to tail file. Provided file path is empty.');
				return;
			}
			timeout = typeof timeout === 'number' ? timeout : 30;
			timeout = timeout <= 0 ? 1 : (timeout > 30 ? 30 : timeout);

			if (!fs.existsSync(file)) {
				var directory = path.dirname(file);
				if (!fs.existsSync(directory)) {
					console.error(`Unable to tail the file '${file}' since the directory '${directory}' does not exist.`);
					return;
				} else {
					watchForFileCreation(file, timeout);
				}
			} else {
				tailFile(file);
			}
		}
	};
})();

module.exports = LogTailService;
