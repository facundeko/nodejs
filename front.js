"use strict";

const inputElement = document.getElementById('input');
const contentElement = document.getElementById('content');
const statusElement = document.getElementById('status');

var myColor = false;
var myName = false;

window.WebSocket = window.WebSocket || window.MozWebSocket;

if (!window.WebSocket) {
  contentElement.innerHTML = "<h>Sorry, your browser does not support WebSocket.</h>";
  inputElement.style = "display: none";
  statusElement.style = "display: none";
}

const connection = new WebSocket('ws://localhost:9090');

connection.addEventListener('open', function(e) {
  inputElement.removeAttribute('disabled');
  statusElement.innerHTML = 'Enter alias to show:';
  statusElement.style = 'font-style: italic';
});

connection.addEventListener('error', function (error) {
  contentElement.innerHTML = '<h>Sorry, but there is problem with your connection, or the server is down.</h>';
});

connection.addEventListener('message', function (message) {

  var json;
  try {
    json = JSON.parse(message.data);
  } catch (e) {
    console.log('Invalid JSON: ', message.data);
    return;
  }

  if (json.type === 'color') {
    myColor = json.data;
    statusElement.innerHTML = myName + ': ';
    statusElement.style.color = myColor;
    inputElement.removeAttribute('disabled');
    inputElement.focus();
  } else if (json.type === 'history') {
    for (var i=0; i < json.data.length; i++) {
      publishMessage(json.data[i].subscriber, json.data[i].text, json.data[i].color, new Date(json.data[i].time));
    }
  } else if (json.type === 'message') {
    inputElement.removeAttribute('disabled');
    publishMessage(json.data.subscriber, json.data.text, json.data.color, new Date(json.data.time));
  } else {
    console.log('JSON not valid: ', json);
  }
});

/**
 * Send message when user presses Enter key
 */
input.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    const message = inputElement.value;

    if (!message) {
      return;
    }

    connection.send(message);
    inputElement.value = '';
    inputElement.setAttribute('disabled', 'disabled');

    if (!myName) {
      myName = message;
    }
  }
});

function publishMessage(subscriber, message, color, time) {
  contentElement.innerHTML += '<p><span style="color:' + color + '">['
      + subscriber + '</span> - '
      + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':'
      + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())
      + '] : ' + message + '</p>';
  contentElement.scrollTop = contentElement.scrollHeight;
  inputElement.focus();
}

setInterval(function() {
  if (connection.readyState !== 1) {
    statusElement.innerHTML = 'ERROR';
    statusElement.style = 'color: red';
    inputElement.setAttribute('disabled', 'disabled');
    inputElement.value = 'Unable to communicate with the WebSocket server.';    
  }
}, 5000);