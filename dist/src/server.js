// the polyfills must be the first thing imported in node.js
//import 'angular2-universal-polyfills';
"use strict";
var path = require('path');
var express = require('express');
var expSession = require('express-session');
var sharedSession = require("express-socket.io-session");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var fileUpload = require('express-fileupload');
// Angular 2
//import {enableProdMode} from '@angular/core';
// Angular 2 Universal
var angular2_express_engine_1 = require('angular2-express-engine');
// enable prod for faster renders
//enableProdMode();
var app = express();
var ROOT = path.resolve(__dirname, '..');
var BUILDPATH = '../RsDesktop/dist/client';
//var conf =  fs.readFileSync(path.join(path.join(path.resolve(ROOT, '..'), 'RsServer'),'config.json'), 'utf8').replace(/\n/g, '').replace(/\r/g, '');
//conf = JSON.parse(conf);
var conf = require('./config.js');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers["origin"]);
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// Express View
app.engine('.html', angular2_express_engine_1.createEngine({}));
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'html');
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
var session = expSession({
    secret: 'Studenz_051278',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false }
});
app.use(session);
// Serve static files
app.use('/assets', express.static(path.join(BUILDPATH, 'assets')));
app.use(express.static(BUILDPATH, { index: false }));
app.use('/img', express.static(conf.development.rsBaseDir + '/img'));
app.use(fileUpload());
//Fileupload
var upload = require('../../controller/upload.js')(conf.development);
app.post('/upload', function (req, res) {
    if (!req["files"]) {
        res.send('No files were uploaded.');
        return;
    }
    upload.uploadFile(req, function () {
        res.json({ base64: new Buffer(req.files.file.data).toString('base64'), name: req.files.file.name });
    });
});
// use indexFile over ngApp only when there is too much load on the server
function indexFile(req, res) {
    // when there is too much load on the server just send
    // the index.html without prerendering for client-only
    res.sendFile('/index.html', { root: BUILDPATH });
}
app.get("/", function (req, res) {
    indexFile(req, res);
});
var RsKnexConnection_1 = require('./RsKnexConnection');
var dbCon = new RsKnexConnection_1.RsKnexConnection(conf.development.db);
var server = app.listen(process.env.PORT || 80, function () {
    console.log("Listening on: http://localhost:" + server.address().port);
});
var RsSocket_1 = require('./RsSocket');
new RsSocket_1.RsSocket(sharedSession, session, server, dbCon, conf.development);
//# sourceMappingURL=server.js.map