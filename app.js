var express = require('express');
var socketIo = require('socket.io');
var md = require('mobile-detect');
var app = express();
var http = require('http').Server(app);
app.use(function (req, res, next) {
    var mDetect = new md(req.headers['user-agent']);
    app.set('platform', mDetect);
    console.log(mDetect.mobile());
    next();
});
app.get('/mobile', function (req, res) {
    var platform = app.get('platform');
    if (platform.mobile()) {
        app.use('/', express.static(__dirname + '/RsMobile/www'));
        res.sendFile(__dirname + '/RsMobile/www/index.html');
    }
    else {
        res.sendFile('./index.html');
    }
});
var io = socketIo(http);
io.on('connection', function (socket) {
    console.log(socket);
});
http.listen(80);
//# sourceMappingURL=app.js.map