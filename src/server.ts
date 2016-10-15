// the polyfills must be the first thing imported in node.js
//import 'angular2-universal-polyfills';

import * as path from 'path';
import * as express from 'express';
import * as expSession from 'express-session';


var sharedSession = require("express-socket.io-session");

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
var fs = require('fs');
var fileUpload = require('express-fileupload');
// Angular 2
//import {enableProdMode} from '@angular/core';
// Angular 2 Universal
import {createEngine} from 'angular2-express-engine';

// enable prod for faster renders
//enableProdMode();

const app = express();
const ROOT = path.resolve(__dirname, '..');
const BUILDPATH = '../RsDesktop/dist/client';
//var conf =  fs.readFileSync(path.join(path.join(path.resolve(ROOT, '..'), 'RsServer'),'config.json'), 'utf8').replace(/\n/g, '').replace(/\r/g, '');
//conf = JSON.parse(conf);
var conf = require('./config.js');


app.use(function (req, res, next) {

  res.header( "Access-Control-Allow-Origin", req.headers["origin"] );
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");

  res.header("Access-Control-Allow-Headers", "*");

  next();

})


// Express View
app.engine('.html', createEngine({}));
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'html');

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

var session = expSession({
  secret: 'Studenz_051278',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly:false }
})
app.use(session)


// Serve static files
app.use('/assets', express.static(path.join(BUILDPATH, 'assets')));

app.use(express.static(BUILDPATH, {index: false}));
app.use('/img', express.static(conf.development.rsBaseDir + '/img'));


app.use(fileUpload());

interface FileReq extends Request{
  files:{
    file:{
      data:any,
      name:string
    }
  }
}

//Fileupload
var upload = require('../../controller/upload.js')(conf.development);
app.post('/upload', function(req  : FileReq , res) {

  if (!req["files"]) {
    res.send('No files were uploaded.');
    return;
  }
  upload.uploadFile(req, function () {
    res.json({base64: new Buffer(req.files.file.data).toString('base64'), name: req.files.file.name})
  });
})

// use indexFile over ngApp only when there is too much load on the server
function indexFile(req, res) {
  // when there is too much load on the server just send
  // the index.html without prerendering for client-only
  res.sendFile('/index.html', {root:  BUILDPATH});
}



app.get("/", function (req, res) {

  indexFile(req, res);

})

import {RsKnexConnection} from './RsKnexConnection';
var dbCon: RsKnexConnection = new RsKnexConnection(conf.development.db);


let server = app.listen(process.env.PORT || 80, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

import {RsSocket} from './RsSocket';

import {Request} from "express-serve-static-core";


new RsSocket(sharedSession, session, server, dbCon, conf.development);

