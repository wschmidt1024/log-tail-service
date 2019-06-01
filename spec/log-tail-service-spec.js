const fs = require('fs');
const os = require('os');
var publisher = require('../src/socket-io-push');
var logger = require('../src/log-tail-service');

describe('Logger start method', function () {
	beforeEach(function () {
		jasmine.clock().install();
	});
	afterEach(function () {
		jasmine.clock().uninstall();
	});
	it('writes error to console when provided file is undefined', function () {
		let spyUndefined = spyOn(console, 'error');

		logger.start(undefined, 30, (message) => { });

		expect(spyUndefined).toHaveBeenCalledWith('Unable to tail file. Provided file path is undefined, null, or empty.');
	});
	it('writes error to console when provided file is null', function () {
		let spyNull = spyOn(console, 'error');

		logger.start(null, 30, (message) => { });

		expect(spyNull).toHaveBeenCalledWith('Unable to tail file. Provided file path is undefined, null, or empty.');
	});
	it('writes error to console when provided file is empty', function () {
		let spyEmpty = spyOn(console, 'error');

		logger.start('', 30, (message) => { });

		expect(spyEmpty).toHaveBeenCalledWith('Unable to tail file. Provided file path is undefined, null, or empty.');
	});
	it('writes error to console indicating that the directory does not exist', function () {
		let spyMissing = spyOn(console, 'error');

		logger.start('./missing/log.txt', 30, (message) => { });

		expect(spyMissing).toHaveBeenCalledWith("Unable to tail the file './missing/log.txt' since the directory './missing' does not exist.");
	});
	it('writes log to console indicating file does not exist and is waiting to be created', function () {
		let = spyWaiting = spyOn(console, 'log');

		logger.start('missing.txt', 30, (message) => { });

		expect(spyWaiting).toHaveBeenCalledWith("File 'missing.txt' does not exist. Waiting for it to be created...");
	});
	it('writes log to console indicating file is being tailed', function () {
		let spyTailed = spyOn(console, 'log');

		logger.start('./spec/log.txt', 30, (message) => { });

		expect(spyTailed).toHaveBeenCalledWith("Tailing Log File: './spec/log.txt'");
	});
	it('defaults timeout to 30 seconds when a non-number is provided for timeout', function () {
		var defaultTimeout = 30;
		let = spyTimeout = spyOn(console, 'log');

		logger.start('./spec/missing.txt', null, (message) => { });

		expect(spyTimeout).toHaveBeenCalledTimes(1); // 'awaiting file creation' message
		jasmine.clock().tick(defaultTimeout * 1000 - 1);
		expect(spyTimeout).toHaveBeenCalledTimes(1);
		jasmine.clock().tick(1);
		expect(spyTimeout).toHaveBeenCalledTimes(2);
		expect(spyTimeout).toHaveBeenCalledWith("File './spec/missing.txt' has not been created within allotted time and this service will no longer watch for its creation.");
	});
	it('writes log to console indicating it no longer waits for the missing file to be created', function () {
		var timeout = 1;
		let spyStopWaiting = spyOn(console, 'log');

		logger.start('./spec/missing.txt', timeout, (message) => { });

		expect(spyStopWaiting).toHaveBeenCalledTimes(1); // 'awaiting file creation' message
		jasmine.clock().tick(timeout * 1000 - 1);
		expect(spyStopWaiting).toHaveBeenCalledTimes(1);
		jasmine.clock().tick(1);
		expect(spyStopWaiting).toHaveBeenCalledTimes(2);
		expect(spyStopWaiting).toHaveBeenCalledWith("File './spec/missing.txt' has not been created within allotted time and this service will no longer watch for its creation.");
	});

	//TODO: figure out why this test does not pass

	// it('writes log to console indicating it no longer waits for the missing file to be created', function () {
	// 	let spyCreated = spyOn(console, 'log');

	// 	logger.start('./spec/new.txt', 30, (message) => { });

	// 	expect(spyCreated).toHaveBeenCalledWith("File './spec/new.txt' does not exist. Waiting for it to be created...");
	// 	fs.writeFileSync('./spec/new.txt', `test${os.EOL}`);
	// 	expect(spyCreated).toHaveBeenCalledWith("Tailing Log File: './spec/new.txt'");
	// 	fs.unlinkSync('./spec/new.txt');
	// });

	//TODO: figure out why this test does not pass

	// it('fires publish function', function () {
	// 	var o = {};
	// 	o.publish = function (message) { console.log(message); };
	// 	spyOn(o, 'publish');
	// 	spyOn(console, 'log');

	// 	logger.start('./spec/log.txt', 30, o.publish);
	// 	expect(console.log).toHaveBeenCalledWith("Tailing Log File: './spec/log.txt'");

	// 	fs.writeFileSync('./spec/log.txt', `test${os.EOL}`);
	// 	expect(o.publish).toHaveBeenCalledTimes(1);
	// 	expect(o.publish).toHaveBeenCalledWith('test');

	// 	fs.writeFileSync('./spec/log.txt', '');
	// });
});
