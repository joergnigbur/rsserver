// the polyfills must be the first thing imported in node.js
//import 'angular2-universal-polyfills';

import * as path from 'path';
import * as express from 'express';
import * as expSession from 'express-session';

process.env.TZ = 'Europe/Berlin';
console.log(new Date());

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
const BUILDPATH = '../rsdesktop/dist/client';
//var conf =  fs.readFileSync(path.join(path.join(path.resolve(ROOT, '..'), 'rsserver'),'config.json'), 'utf8').replace(/\n/g, '').replace(/\r/g, '');
//conf = JSON.parse(conf);
var conf = require('./config.js');


app.use(function (req, res, next) {

  //res.header( "Access-Control-Allow-Origin", req.headers["origin"] );
  res.header("Access-Control-Allow-Origin", "*");
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

app.use('/ckeditor', express.static('../rsdesktop/node_modules/ckeditor'));
app.use(express.static(BUILDPATH, {index: false}));
app.use('/img', express.static(conf.development.rsBaseDir + '/img'));


app.use(fileUpload());


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
import {RsResourceServer} from './RsResourceServer';
import {RsSocket} from './RsSocket';

var dbCon: RsKnexConnection = new RsKnexConnection(conf.development.db);

new RsResourceServer(conf, app, dbCon)

let server = app.listen(80 || process.env.PORT || 80, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});


new RsSocket(sharedSession, session, server, dbCon, conf.development);


var exec = require('../../controller/exec.js');

  var jController = require('../../controller/jobs.js');

  app.get('/complete/:action/:searchText', (req, res)=>{

    jController.dbCon = dbCon.getConnection();
    jController[req.params.action]({filter:{searchText:req.params.searchText}}, result => {

      res.json(result);

    })
  })