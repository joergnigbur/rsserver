"use strict";
// the polyfills must be the first thing imported in node.js
require('angular2-universal/polyfills');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var RsSocket_1 = require('./RsSocket');
var RsKnexConnection_1 = require('./RsKnexConnection');
// Angular 2
var core_1 = require('@angular/core');
// Angular 2 Universal
var angular2_universal_1 = require('angular2-universal');
// enable prod for faster renders
core_1.enableProdMode();
var app = express();
var ROOT = path.join(path.resolve(__dirname));
var AppROOT = path.join(path.resolve(__dirname), 'RsDesktop');
// Express View
app.engine('.html', angular2_universal_1.expressEngine);
app.set('views', path.join(AppROOT, 'src'));
app.set('view engine', 'html');
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
// Serve static files
app.use('/assets', express.static(path.join(AppROOT, 'src/assets'), { maxAge: 30 }));
app.use(express.static(path.join(AppROOT, 'dist/client'), { index: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
var main_node_1 = require('./RsDesktop/src/main.node');
// Routes with html5pushstate
// ensure routes match client-side-app
app.get('/', main_node_1.ngApp);
app.get('/about', main_node_1.ngApp);
app.get('/about/*', main_node_1.ngApp);
app.get('/home', main_node_1.ngApp);
app.get('/home/*', main_node_1.ngApp);
// use indexFile over ngApp only when there is too much load on the server
function indexFile(req, res) {
    // when there is too much load on the server just send
    // the index.html without prerendering for client-only
    res.sendFile('/index.html', { root: path.join(AppROOT, 'src') });
}
app.get('*', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var pojo = { status: 404, message: 'No Content' };
    var json = JSON.stringify(pojo, null, 2);
    res.status(404).send(json);
});
// Server
var server = app.listen(process.env.PORT || 80, function () {
    console.log("Listening on: http://localhost:" + server.address().port);
});
var conf = require('./config.json');
var dbCon = new RsKnexConnection_1.RsKnexConnection(conf.development.db);
new RsSocket_1.RsSocket(server, dbCon, {});
