"use strict";

var webSocketsServerPort = 9090;
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */

var numberOfSavedMessages = 500;
var history = [ ];
var subscribers = [ ];


/**
 * Helping and initializing functions 
 */
 
function clearString(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function clearDate(date) {
    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
	var hour = d.getHours(), minutes = d.getMinutes(), seconds = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    var dateStr = [year, month, day].join('-');
	var timeStr = [hour, minutes, seconds].join(':');
	
	return dateStr + '|' + timeStr;
}

var colors = [ 'red', 'sienna', 'blue', 'magenta', 'purple', 'yellow', 'orange', 'silver', 'green', 'black' ];
colors.sort(function(a,b) { return Math.random() > 0.5; } );

var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log('[' + (clearDate(new Date())) + '] - Server is listening on port ' + webSocketsServerPort + '\n');
});

var wsServer = new webSocketServer({
    httpServer: server
});

/**
 * Registering new subscribers and listening for incoming messages
 */

wsServer.on('request', function(request) {
    console.log('[' + (clearDate(new Date())) + '] - Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin); 
    // subscriber index to remove it on 'close' event
    var index = subscribers.push(connection) - 1;
    var userName = false;
    var userColor = false;

    console.log('[' + (clearDate(new Date())) + '] - Connection accepted.' + '\n');

    // send chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            if (userName === false) {
                userName = clearString(message.utf8Data);
                userColor = colors.shift();
                connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
                console.log('[' + (clearDate(new Date())) + '] - User logged as: ' + userName + ' (in ' + userColor + ').' + '\n');

            } else {
                // console.log('[' + (clearDate(new Date())) + '] - Received message from ' + userName + ': ' + message.utf8Data);

                var obj = {
                    time: (new Date()).getTime(),
                    text: clearString(message.utf8Data),
                    subscriber: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-numberOfSavedMessages);

                /**
                 * Publish message to all subscribers
                 */
                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < subscribers.length; i++) {
                    subscribers[i].sendUTF(json);
                }
            }
        }
    });

    connection.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            var nameToShow = (connection.remoteAddress === undefined) ? userName : connection.remoteAddress;
            console.log('[' + (clearDate(new Date())) + '] - Subscriber ' + nameToShow + ' disconnected.');
            subscribers.splice(index, 1);
            colors.push(userColor);
        }
    });
});