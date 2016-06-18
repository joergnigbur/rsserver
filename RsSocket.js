"use strict";
var Socket = require('socket.io');
var RsSocket = (function () {
    function RsSocket(http, dbCon) {
        this.dbCon = dbCon;
        this.io = Socket(http);
        var self = this;
        this.io.on('connection', function (socket) {
            console.log('Socket ' + socket.id + ' connected');
            socket.on('query', function (data) {
                var controller = require('./controller/' + data.controller);
                controller.execSocket(socket, { baseDir: __dirname }, self.dbCon.getConnection(), data);
            });
        });
    }
    return RsSocket;
}());
exports.RsSocket = RsSocket;
//# sourceMappingURL=RsSocket.js.map