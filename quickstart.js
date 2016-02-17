var ioLib = require('socket.io');
var http = require('http');
var path = require('path');
var express = require('express');

var Quickstart = function(options) {
  this.sockets = [];

  this.app = express();

  this.startLongPolling = options.startLongPolling;
  this.getEndpoints = options.getEndpoints;
  this.subscribeToPresses = options.subscribeToPresses;
  this.unsubscribeToPresses = options.unsubscribeToPresses;
  this.getPresses = options.getPresses;
  this.updateBlinkPattern = options.updateBlinkPattern;
  this.blink = options.blink;
};

Quickstart.prototype.listen = function(port, callback) {
  var _this = this;

  this.server = http.Server(this.app);

  this.io = ioLib(this.server);
  this.io.on('connection', function (socket) {
    _this.sockets.push(socket);

    socket.on('subscribe-to-presses', function (data) {
      _this.subscribeToPresses(data, function(error) {
        if (error) throw error;
        socket.emit('subscribed-to-presses', {
          endpointName: data.endpointName
        });
      });
    });

    socket.on('unsubscribe-to-presses', function(data) {
      _this.unsubscribeToPresses(data, function(error) {
        if (error) throw error;
        socket.emit('unsubscribed-to-presses', {
          endpointName: data.endpointName
        });
      });
    });

    socket.on('get-presses', function(data) {
      _this.getPresses(data, function(error, value) {
        if (error) throw error;
        socket.emit('presses', {
          endpointName: data.endpointName,
          value: value
        });
      });
    });

    socket.on('update-blink-pattern', function(data) {
      _this.updateBlinkPattern(data, function(error) {
        if (error) throw error;
      });
    });

    socket.on('blink', function (data) {
      _this.blink(data, function(error) {
        if (error) throw error;
      });
    });
  });

  this.app.set('views', path.join(__dirname, 'views'));
  this.app.set('view engine', 'hbs');

  this.app.use(express.static(path.join(__dirname, 'public')));

  this.app.get('/', function (req, res) {
    _this.getEndpoints(function(error, endpoints) {
      if (error) {
        res.send(String(error));
      } else {
        res.render('index', {
          endpoints: endpoints
        });
      }
    });
  });

  this.app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  this.server.listen(port, function() {
    _this.startLongPolling(function(error) {
      callback(error);
    })
  });
}

Quickstart.prototype.handleNotifications = function(notifications, buttonResourceURI) {
  var _this = this;
  notifications.forEach(function(notification) {
    if (notification.path === buttonResourceURI) {
      _this.sockets.forEach(function(socket) {
        socket.emit('presses', {
          endpointName: notification.ep,
          value: notification.payload
        });
      });
    }
  });
}

module.exports = Quickstart;