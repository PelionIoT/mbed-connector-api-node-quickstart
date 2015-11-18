var express = require('express');
var MbedConnector = require('mbed-connector');
var app = express();

/* BEGIN EDITS */
//var mbedConnectorAccessKey = "Your Access Key";
//var endpointName = "Your endpoint name";
var port = 3000;
/* END EDITS */

var mbedConnector = new MbedConnector("https://api.connector.mbed.com", { token: mbedConnectorAccessKey });

app.get('/', function (req, res) {
  mbedConnector.getResource(endpointName, 'Test/0/D', function(error, data) {
    if (error) {
      var msg = 'There was an error when trying to get resource "Test/0/D" from endpoint "' + endpointName + '".<br>'
      msg += 'Is your device connected properly?<br><br>';

      msg += 'HTTP status code: ' + error.status + '<br>';
      msg += 'Response body: ' + error.response.body;

      res.send(msg);
    } else {
      res.send('Button Presses: ' + data);
    }
  });
});

var server = app.listen(3000, function () {
  console.log('mbed Device Connector Quickstart listening at http://localhost:%s', port);

  mbedConnector.startLongPolling();
});

