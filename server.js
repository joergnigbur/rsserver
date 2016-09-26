"use strict";
require('angular2-universal/polyfills');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var RsSocket_1 = require('./RsSocket');
var RsKnexConnection_1 = require('./RsKnexConnection');
var core_1 = require('@angular/core');
var angular2_universal_1 = require('angular2-universal');
core_1.enableProdMode();
var app = express();
var ROOT = path.join(path.resolve(__dirname));
var AppROOT = path.join(path.resolve(__dirname, '..'), 'RsDesktop');
app.engine('.html', angular2_universal_1.expressEngine);
app.set('views', path.join(AppROOT, 'src'));
app.set('view engine', 'html');
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(AppROOT, 'src/assets'), { maxAge: 30 }));
app.use(express.static(path.join(AppROOT, 'dist/client'), { index: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
function indexFile(req, res) {
    res.sendFile('/index.html', { root: path.join(AppROOT, 'src') });
}
app.get('*', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var pojo = { status: 404, message: 'No Content' };
    var json = JSON.stringify(pojo, null, 2);
    res.status(404).send(json);
});
var server = app.listen(process.env.PORT || 80, function () {
    console.log("Listening on: http://localhost:" + server.address().port);
});
var conf = require('./config.json');
var dbCon = new RsKnexConnection_1.RsKnexConnection(conf.development.db);
new RsSocket_1.RsSocket(server, dbCon, {});
