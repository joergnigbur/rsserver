
app.factory('Socket', function ($rootScope) {
    var socket = io.connect('http://localhost:3000');
    var appId = 'angularclient';
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            if (typeof data == 'function') {
                callback = data;
                data = {};
            }
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },
        emitAndListen: function (eventName, data, callback) {
            this.emit(eventName, data, callback);
            this.on(eventName, callback);
        },
        register : function (cid) {
            socket.emit('register', { customerId: 'Fake', clientId: cid, appId: appId });
        }, socket: socket
    };
});
