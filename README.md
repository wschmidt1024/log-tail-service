# log-tail-service

Node.js module that tails a specified log file. Updates to the log file are published for subcribers to consume.

## Usage

### Using As a Module

First, create a publisher that broadcasts updates from the log file.

```js
var publisher = require('./src/socket-io-push');
publisher.init(port, topic);
```

`port` - The port through which log updates are published. Defaults to 3001.

`topic` - The topic under which log updates are published. Defaults to `'log-tail-service-message'`.

Second, create the logger which will tail the log file.

```js
var logger = require('./src/log-tail-service');
logger.start(path, timeout, callback);
```

`path` - Path to the log file to be tailed.

`timeout` - If the log file does not exist, the number of seconds to wait for the file to be created.

`callback` - The function used to publish the log update for subscribers. This function takes a single parameter, which is the text update from the log file. Use the function defined by the publisher.

### Using start.js

You may use the start.js file to tail a file with this project. Just change the settings in the logger.start code in the start.js file and run this command in you terminal:

`node start`

### Using the Electron Application

You may also start this service using the Electron application using the command, `npm start`. This provides a UI for changing settings and starting the service.

### Using the subscriber.html file

Run this HTML file in a browser to verify that the messages can be received and processed by a subscriber.

## Example

```js
var publisher = require('./src/socket-io-push');
publisher.init(4000, 'test-topic');
var logger = require('./src/log-tail-service');
logger.start('c:\\Logs\\log.txt', 30, publisher.publish);
```

## Dependencies

This module uses the following Node.js modules:

`always-tail` - Used to tail the log file.

`chokidar` - Used to watch for log file creation when it does not yet exist.

`socket.io` - Used to publish to subscribers.

`electron.js` - Used to create Electron application.
