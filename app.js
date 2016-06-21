var express = require('express');
var RsSocket_1 = require('./RsSocket');
var RsKnexConnection_1 = require('./RsKnexConnection');
var md = require('mobile-detect');
var conf = require('./config.json');
var app = express();
var http = require('http').Server(app);
var dbCon = new RsKnexConnection_1.RsKnexConnection(conf.development.db);
app.use(function (req, res, next) {
    if (!app.get('platform')) {
        var mDetect = new md(req.headers['user-agent']);
        app.set('platform', mDetect);
        console.log(mDetect.mobile());
    }
    if (!app.get('db')) {
        app.set('db', dbCon);
    }
    next();
});
new RsSocket_1.RsSocket(http, dbCon);
http.listen(3000);
app.use('/img', express.static(__dirname + '/img'));
app.use('/html', express.static('C:\\xampp\\htdocs\\recspec\\templates'));
app.get('/mobile', function (req, res) {
    app.use('/', express.static(__dirname + '/RsMobile/www'));
    res.sendFile(__dirname + '/RsMobile/www/index.html');
});
//# sourceMappingURL=app.js.map