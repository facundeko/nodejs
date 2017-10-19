# Websockets

## Synopsis 

Basic NodeJS, websocket-oriented server.
It consists on a publisher sending messages to the registered subscribers.

## Built with 
[NodeJS v6.11.3](https://nodejs.org/en/)


## Installation

In order to successfully run the project, you must use the next Node modules

* [Tape](https://github.com/substack/tape) Testing tool for Node and browsers
* [Tapspec](https://github.com/scottcorgan/tap-spec) Formatted TAP output
* [Websocket](https://github.com/sitegui/nodejs-websocket) A nodejs module for websocket server and client

To start the server, just execute the next command 
``` 
node server.js
```
and, after seeing the result in the console, open the provided html file.

## Tests

To run the tests script, just execute the next command
```
node test/test.js | node_modules/.bin/tap-spec
```
You will see the result of the execution in the console.
	
## License 

Free license.
