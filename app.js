// Load .env config (silently fail if no .env present)
require('dotenv').config({ silent: true });

// Require necessary libraries
var async = require('async');
var ioLib = require('socket.io');
var http = require('http');
var path = require('path');
var express = require('express');
var MbedConnectorApi = require('mbed-connector-api');

// CONFIG (change these)
var accessKey = process.env.ACCESS_KEY;
var port = process.env.PORT || 8080;

// Paths to resources on the endpoints
var blinkResourceURI = '/3201/0/5850';
var blinkPatternResourceURI = '/3201/0/5853';
var buttonResourceURI = '/3200/0/5501';

// Ensure the "ACCESS_KEY" environment variable is set
if (!accessKey) {
  console.error('Please set the environment variable "ACCESS_KEY" to your mbed Device Connector Access Key.');
  process.exit(1);
}

if (!process.env.ACCESS_KEY && (!accessKey || accessKey === "<Access Key>")) {
  console.log("Please define your mbed Device Server Access Key as an environment variable (ACCESS_KEY) or in app.js.");
  process.exit(1);
}

// Instantiate an mbed Device Connector object
var mbedConnectorApi = new MbedConnectorApi({
  accessKey: process.env.ACCESS_KEY || accessKey // Allow access key to be overriden by an environment variable if need be
});

// Create the express app
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  // Get all of the endpoints and necessary info to render the page
  mbedConnectorApi.getEndpoints(function(error, endpoints) {
    if (error) {
      throw error;
    } else {
      // Setup the function array
      var functionArray = endpoints.map(function(endpoint) {
        return function(mapCallback) {
          mbedConnectorApi.getResourceValue(endpoint.name, blinkPatternResourceURI, function(error, value) {
            endpoint.blinkPattern = value;
            mapCallback(error);
          });
        };
      });

      // Fetch all blink patterns in parallel, finish whell all HTTP
      // requests are complete (uses Async.js library)
      async.parallel(functionArray, function(error) {
        if (error) {
          res.send(String(error));
        } else {
          res.render('index', {
            endpoints: endpoints
          });
        }
      });
    }
  });
});

// Handle unexpected server errors
app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

var sockets = [];
var server = http.Server(app);
var io = ioLib(server);

io.on('connection', function (socket) {
  // Add new client to array of client upon connection
  sockets.push(socket);

  socket.on('subscribe-to-presses', function (data) {
    // Subscribe to all changes of resource /3200/0/5501 (button presses)
    mbedConnectorApi.putResourceSubscription(data.endpointName, buttonResourceURI, function(error) {
      if (error) throw error;
      socket.emit('subscribed-to-presses', {
        endpointName: data.endpointName
      });
    });
  });

  socket.on('unsubscribe-to-presses', function(data) {
    // Unsubscribe from the resource /3200/0/5501 (button presses)
    mbedConnectorApi.deleteResourceSubscription(data.endpointName, buttonResourceURI, function(error) {
      if (error) throw error;
      socket.emit('unsubscribed-to-presses', {
        endpointName: data.endpointName
      });
    });
  });

  socket.on('get-presses', function(data) {
    // Read data from GET resource /3200/0/5501 (num button presses)
    mbedConnectorApi.getResourceValue(data.endpointName, buttonResourceURI, function(error, value) {
      if (error) throw error;
      socket.emit('presses', {
        endpointName: data.endpointName,
        value: value
      });
    });
  });

  socket.on('update-blink-pattern', function(data) {
    // Set data on PUT resource /3201/0/5853 (pattern of LED blink)
    mbedConnectorApi.putResourceValue(data.endpointName, blinkPatternResourceURI, data.blinkPattern, function(error) {
      if (error) throw error;
    });
  });

  socket.on('blink', function(data) {
    // POST to resource /3201/0/5850 (start blinking LED)
    mbedConnectorApi.postResource(data.endpointName, blinkResourceURI, null, function(error) {
      if (error) throw error;
    });
  });

  socket.on('disconnect', function() {
    // Remove this socket from the array when a user closes their browser
    var index = sockets.indexOf(socket);
    if (index >= 0) {
      sockets.splice(index, 1);
    }
  })
});

// When notifications are received through the notification channel, pass the
// button presses data to all connected browser windows
mbedConnectorApi.on('notification', function(notification) {
  if (notification.path === buttonResourceURI) {
    sockets.forEach(function(socket) {
      socket.emit('presses', {
        endpointName: notification.ep,
        value: notification.payload
      });
    });
  }
});

// Start the app
server.listen(port, function() {
  // Set up the notification channel (pull notifications)
  mbedConnectorApi.startLongPolling(function(error) {
    if (error) throw error;
    console.log('mbed Device Connector Quickstart listening at http://localhost:%s', port);
  })
});
