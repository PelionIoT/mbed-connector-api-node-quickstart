var express = require('express');
var path = require('path');
var MbedConnector = require('mbed-connector');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/* BEGIN EDITS */
//var mbedConnectorAccessKey = "Your Access Key";
var port = process.env.PORT || 3000;
/* END EDITS */

var mbedConnector = new MbedConnector({ accessKey: mbedConnectorAccessKey });

var sockets = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  mbedConnector.getEndpoints(function(error, endpoints) {
    if (error) {
      res.send(String(error));
    } else {
      res.render('index', {
        endpoints: endpoints
      });
    }
  });
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

io.on('connection', function (socket) {
  sockets.push(socket);

  socket.on('subscribe-to-presses', function (data) {
    console.log('subscribe-to-presses', data);
    mbedConnector.putResourceSubscription(data.endpointName, 'Test/0/D', function(error) {
      console.log('putResourceSubscription', error);
      if (error) {
        console.log(String(error));
      } else {
        socket.emit('subscribed-to-presses', {
          endpointName: data.endpointName
        });
      }
    });
  });

  socket.on('unsubscribe-to-presses', function (data) {
    console.log('unsubscribe-to-presses', data);
    mbedConnector.deleteResourceSubscription(data.endpointName, 'Test/0/D', function(error) {
      console.log('deleteResourceSubscription', error);
      if (error) {
        console.log(String(error));
      } else {
        socket.emit('unsubscribed-to-presses', {
          endpointName: data.endpointName
        });
      }
    });
  });

  socket.on('get-presses', function (data) {
    console.log('get-presses', data);
    mbedConnector.getResourceValue(data.endpointName, 'Test/0/D', function(error, value) {
      console.log('getResourceValue', error, value);

      socket.emit('presses', {
        endpointName: data.endpointName,
        value: value
      });
    });
  });
});

server.listen(port, function () {
  console.log('mbed Device Connector Quickstart listening at http://localhost:%s', port);

  mbedConnector.startLongPolling();
});

mbedConnector.on('notifications', function(notifications) {
  console.log('notifications', notifications);
  notifications.forEach(function(notification) {
    if (notification.path === '/Test/0/D') {
      sockets.forEach(function(socket) {
        socket.emit('presses', {
          endpointName: notification.ep,
          value: notification.payload
        });
      });
    }
  })
})
