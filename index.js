var platform = require('platform');
var request = require('request');
var pingTimeout = 180; //Seconds
var pingInterval = 90;
var os = require("os");
var config = require('./config.js').getConfig(os.hostname());
var dbCon = require('./db.js').getConnection(config.mysql);
var base = this;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    'pingTimeout': pingTimeout * 1000,
    'pingInterval': pingInterval * 1000
});
s;
app.get('/clients', function (req, res) {
    res.sendFile(__dirname + '/clients.html');
});
app.get('/push', function (req, res) {
    affected = push(req.query);
    res.send('OK, ' + affected + ' devices pushed');
});
console.log("initializing...");
global.administrators = [];
global.clients = [];
function clientMatchesFilterObject(client, filterObject) {
    if (Object.keys(filterObject).length == 0)
        return false; //An empty filter list does NOT match every entry.
    for (var key in filterObject) {
        if (!client.details.hasOwnProperty(key) || (client.details[key] != filterObject[key] && filterObject[key] != '*'))
            return false;
    }
    return true;
}
function push(filterObject, eventName, msg) {
    var clientsPushed = 0;
    if (typeof (eventName) == 'object') {
        msg = eventName;
        eventName = 'push';
    }
    for (var i = 0; i < global.clients.length; i++) {
        var client = global.clients[i];
        if (clientMatchesFilterObject(client, filterObject)) {
            io.to(client.socketId).emit('push', eventName, msg);
            clientsPushed++;
        }
    }
    return clientsPushed;
}
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var routes = require('./jtablegenerator/routes/index');
// view engine setup
app.set('views', path.join(__dirname + '/jtablegenerator/', 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname + '/jtablegenerator/', 'public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(function (req, res, next) {
    res.charset = 'utf-8';
    if (!req.query.controller)
        req.query.controller = 'index';
    if (!req.query.action)
        req.query.action = 'index';
    req.conf = config;
    next();
});
app.use(dbCon.provideConnection);
//app.use('/', routes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
/**
 * SOCKET calls
 *
 * */
function getClientBySocketId(socketId) {
    function socketIdMatches(element, index, array) {
        return element.socketId != socketId;
    }
    var clients = global.clients.filter(socketIdMatches);
    return clients.length > 0 ? clients[0] : false;
}
console.log("connection...");
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        function socketIdDiffers(element, index, array) {
            return element.socketId != socket.id;
        }
        global.clients = global.clients.filter(socketIdDiffers);
        //    socket.emit('reconnect');
        console.log('socket closed: ' + socket.id);
        emitToAdmins('client_disconnected', socket.id);
        global.administrators = global.administrators.filter(socketIdDiffers);
    });
    socket.on('push_all', function (msg) {
        console.log('pushing all');
        io.emit('push', msg);
    });
    socket.on('push_client', function (socketId, msg) {
        console.log('pushing client ' + socketId);
        io.to(socketId).emit('push', msg);
    });
    socket.on('push', function (data) {
        push({ clientId: data.clientId }, { message: data.message + '!!!' });
    });
    socket.on('query', function (data) {
        var controller = require('./controller/' + data.request.controller);
        controller.exec(socket, config, dbCon, data);
        emitToAdmins('client_query', { socketId: socket.id, request: data });
    });
    socket.on('register_admin', function () {
        newAdmin = {
            connectedSince: (new Date().getTime()),
            socketId: socket.id
        };
        global.administrators.push(newAdmin);
        for (var i = 0; i < global.clients.length; i++) {
            var client = global.clients[i];
            socket.emit('client_connected', client);
        }
        console.log('admin registered: ' + JSON.stringify(newAdmin));
    });
    socket.on('register', function (registrationDetails) {
        if (registrationDetails.clientId || registrationDetails.clientId == null)
            registrationDetails.clientId = Math.floor((Math.random() * 10000) + 1);
        var newClient = {
            connectedSince: (new Date().getTime()),
            socketId: socket.id,
            clientId: registrationDetails.clientId,
            app: registrationDetails.app,
            locale: registrationDetails.locale,
        };
        if (global.clients.filter(function (client) {
            return client.socketId == newClient.socketId;
        }).length == 0) {
            console.log('client registered: ' + JSON.stringify(newClient));
            global.clients = global.clients.filter(function (client) {
                return client.clientId != newClient.clientId;
            });
            global.clients.push(newClient);
            emitToAdmins('client_connected', newClient);
        }
        socket.emit('register', { clientId: newClient.clientId, socketId: socket.id, locale: require('./localization.js').i18n(newClient.locale) });
    });
    function emitToAdmins(type, msg) {
        for (var i = 0; i < global.administrators.length; i++) {
            var administrator = global.administrators[i];
            io.to(administrator.socketId).emit(type, msg);
        }
    }
});
console.log("start http.listen...");
http.listen(config.port, function () {
    console.log('listening on *:' + config.port);
});
//# sourceMappingURL=index.js.map