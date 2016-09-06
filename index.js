"use strict";
require('angular2-universal/polyfills');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var core_1 = require('@angular/core');
var angular2_universal_1 = require('angular2-universal');
core_1.enableProdMode();
var app = express();
var ROOT = path.join(__dirname, "RsDesktop");
app.engine('.html', angular2_universal_1.expressEngine);
app.set('views', path.join(ROOT, 'src'));
app.set('view engine', 'html');
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: 30 }));
app.use(express.static(path.join(ROOT, 'www'), { index: false }));
var main_node_1 = require('./RsDesktop/src/main.node');
app.get('/', main_node_1.ngApp);
app.get('/about', main_node_1.ngApp);
app.get('/about/*', main_node_1.ngApp);
app.get('/home', main_node_1.ngApp);
app.get('/home/*', main_node_1.ngApp);
function indexFile(req, res) {
    res.sendFile('/index.html', { root: __dirname });
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
//# sourceMappingURL=index.js.map