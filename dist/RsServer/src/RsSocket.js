"use strict";
var socketIO = require('socket.io');
var RsLocalization_1 = require('./RsLocalization');
var RsSycProvider_1 = require('./RsSycProvider');
var RsSocket = (function () {
    function RsSocket(sharedSession, session, server, dbCon, config) {
        this.clients = [];
        this.socketIds = [];
        this.i18n = new RsLocalization_1.RsLocalization();
        this.dbCon = dbCon;
        this.io = socketIO().attach(server);
        var self = this;
        var sycProvider = new RsSycProvider_1.RsSycProvider();
        this.io.use(sharedSession(session, {
            autoSave: true
        }));
        this.io.on('connection', function (socket) {
            var sessionIst = socket.handshake['session'];
            console.log(sessionIst);
            var client;
            if (!self.isConnected(socket)) {
                sycProvider.connect(socket);
                var locale = socket.client.request.headers.host.match(/\.(de|at|ch)/);
                locale = locale ? locale[1] : 'de';
                client = { socket: socket, socketId: socket.id, locale: locale, connectedSince: new Date() };
                self.clients.push(client);
                self.socketIds.push(socket.id);
                console.log('Socket ' + socket.id + ' connected');
            }
            else {
                client = self.getClientBySocketId(socket.id);
            }
            socket.emit('register', { socketId: socket.id, locale: self.i18n.i18n(locale) });
            socket.on('query', function (data) {
                if (data.request)
                    data = data.request;
                var controller = require('../../controller/' + data.controller);
                controller.execSocket(socket, { session: sessionIst, rsBaseDir: config.rsBaseDir, rsImgServer: config.rsImgServer, baseDir: __dirname, i18n: self.i18n.i18n(client.locale) }, self.dbCon.getConnection(), data);
            });
            socket.on('sycRequest', function (requestName) {
                var controller = require('./../controller/syc.js');
                controller.execSocket(socket, { session: sessionIst, action: requestName, rsBaseDir: config.rsBaseDir, rsImgServer: config.rsImgServer, baseDir: __dirname, i18n: self.i18n.i18n(client.locale) }, self.dbCon.getConnection(), {});
            });
            socket.on("disconnect", function (socket) {
                self.socketIds.splice(self.socketIds.indexOf(socket.id), 1);
            });
        });
    }
    RsSocket.prototype.isConnected = function (socket) {
        return this.clients.filter(function (openSocket) {
            return socket.id == openSocket.socketId;
        }).length > 0;
    };
    RsSocket.prototype.getClientBySocketId = function (id) {
        var sockets = this.clients.filter(function (openSocket) {
            return id == openSocket.socketId;
        });
        return sockets.length > 0 ? null : sockets[0];
    };
    return RsSocket;
}());
exports.RsSocket = RsSocket;
//# sourceMappingURL=RsSocket.js.map