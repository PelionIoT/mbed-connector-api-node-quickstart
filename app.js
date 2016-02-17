// Require necessary libraries
var async = require('async');
var MbedConnector = require('mbed-connector');
var Quickstart = require('./quickstart');

// CONFIG (change these)
var accessKey = "<Access Key>";
var port = 3000;

// Paths to resources on the endpoints
var blinkResourceURI = "/3201/0/5850";
var blinkPatternResourceURI = "/3201/0/5853";
var buttonResourceURI = "/3200/0/5501";

// Instantiate an mbed Device Connector object
var mbedConnector = new MbedConnector({
  accessKey: process.env.ACCESS_KEY || accessKey // Allow access key to be overriden by an environment variable if need be
});

// Create the Quickstart app
var myQuickstart = new Quickstart({
  // Set up the notification channel (pull notifications)
  startLongPolling: function(callback) {
    mbedConnector.startLongPolling(callback);
  },

  // Get all of the endpoints and necessary info to render the page
  getEndpoints: function(callback) {
    mbedConnector.getEndpoints(function(error, endpoints) {
      if (error) {
        callback(error);
      } else {
        // Setup the function array
        var functionArray = endpoints.map(function(endpoint) {
          return function(mapCallback) {
            mbedConnector.getResourceValue(endpoint.name, blinkPatternResourceURI, function(error, value) {
              endpoint.blinkPattern = value;
              mapCallback(error);
            });
          };
        });

        // Fetch all blink patterns in parallel, finish whell all HTTP
        // requests are complete (uses Async.js library)
        async.parallel(functionArray, function(error) {
          callback(error, endpoints);
        });
      }
    });
  },

  // Called when the "Subscribe" checkbox is checked
  subscribeToPresses: function(data, callback) {
    mbedConnector.putResourceSubscription(data.endpointName, buttonResourceURI, callback);
  },

  // Called when the "Subscribe" checkbox is unchecked
  unsubscribeToPresses: function(data, callback) {
    mbedConnector.deleteResourceSubscription(data.endpointName, buttonResourceURI, callback);
  },

  // Called when the "GET" button is clicked
  getPresses: function(data, callback) {
    mbedConnector.getResourceValue(data.endpointName, buttonResourceURI, callback);
  },

  // Called when the "Update (PUT)" button is clicked
  updateBlinkPattern: function(data, callback) {
    mbedConnector.putResourceValue(data.endpointName, blinkPatternResourceURI, data.blinkPattern, callback);
  },

  // Called when the "Blink (POST)" button is clicked
  blink: function(data, callback) {
    mbedConnector.postResource(data.endpointName, blinkResourceURI, null, callback);
  }
});

// When notifications are received through the notification channel, pass the
// data to the quickstart app for handling
mbedConnector.on('notifications', function(notifications) {
  myQuickstart.handleNotifications(notifications, buttonResourceURI);
});

// Start the quickstart app listening on the given port
myQuickstart.listen(port, function(error) {
  if (error) throw error;
  console.log('mbed Device Connector Quickstart listening at http://localhost:%s', port);
});