var Socket = require('socket.io');
var RsLocalization_1 = require('./RsLocalization');
var RsSocket = (function () {
    function RsSocket(http, dbCon) {
        this.clients = [];
        this.i18n = new RsLocalization_1.RsLocalization();
        this.dbCon = dbCon;
        this.io = Socket(http);
        var self = this;
        this.io.on('connection', function (socket) {
            var client;
            if (!self.isConnected(socket)) {
                var locale = socket.client.request.headers.host.match(/\.(de|at|ch)/);
                locale = locale ? locale[1] : 'de';
                client = { socket: socket, socketId: socket.id, locale: locale, connectedSince: new Date() };
                self.clients.push(client);
                console.log('Socket ' + socket.id + ' connected');
            }
            else {
                client = self.getClientBySocketId(socket.id);
            }
            socket.emit('register', { socketId: socket.id, locale: self.i18n.i18n(locale) });
            socket.on('query', function (data) {
                if (data.request)
                    data = data.request;
                var controller = require('./controller/' + data.controller);
                controller.execSocket(socket, { baseDir: __dirname, i18n: self.i18n.i18n(client.locale) }, self.dbCon.getConnection(), data);
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
})();
exports.RsSocket = RsSocket;
//# sourceMappingURL=RsSocket.js.map