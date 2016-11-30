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
var BUILDPATH = '../rsdesktop/dist/client';
//var conf =  fs.readFileSync(path.join(path.join(path.resolve(ROOT, '..'), 'rsserver'),'config.json'), 'utf8').replace(/\n/g, '').replace(/\r/g, '');
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
app.use('/ckeditor', express.static('../rsdesktop/node_modules/ckeditor'));
app.use(express.static(BUILDPATH, { index: false }));
app.use('/img', express.static(conf.development.rsBaseDir + '/img'));
app.use(fileUpload());
//Fileupload
var apCtrl = require("../../controller/application.js");
var jCtrl = require("../../controller/jobber.js");
var upload = require('../../controller/upload.js')(conf.development);
app.post('/upload', function (req, res) {
    if (!req["files"]) {
        res.send('No files were uploaded.');
        return;
    }
    upload.uploadFile(req, function (additional) {
        var file = { src: undefined, name: req.files.file.name };
        Object.assign(file, additional);
        if (req.files.file.name.match(/\.(pdf)$/i) == null) {
            jCtrl.persistPicture(req, file);
        }
        res.json(file);
    });
});
function writeAsImage(res, name, content) {
    res.writeHead(200, {
        'Content-Type': 'image/' + name.match(/\.(jpe?g|png)$/i)[1],
        'Content-Disposition': 'attachment;filename="' + name + '"',
        'Content-Length': content.length
    });
    res.end(content);
}
function writeAsPdf(res, name, content) {
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename="' + name + '"',
        'Content-Length': content.length
    });
    res.end(content);
}
app.get('/app_endix', function (req, res) {
    var filter = { filter: { application_id: req.query.id, filename: req.query.fname } };
    apCtrl.dbCon = dbCon.getConnection();
    apCtrl.getAppFiles(filter, function (files) {
        if (req.query.fname.match(/\.(pdf)$/i) != null)
            writeAsPdf(res, req.query.fname, files.records[0].data);
        else
            writeAsImage(res, req.query.fname, files.records[0].data);
    });
});
app.get('/pdf', function (req, res) {
    var path = jCtrl.getUserFolder(req, req.query.fname);
    if (!path) {
        res.write("ERROR - no Session alive");
        res.end();
        return;
    }
    var content = fs.readFileSync(path);
    writeAsPdf(res, req.query.fname, content);
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