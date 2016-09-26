// the polyfills must be the first thing imported in node.js
import 'angular2-universal/polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {RsSocket} from './RsSocket';
import {RsKnexConnection} from './RsKnexConnection';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { expressEngine } from 'angular2-universal';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname));
const AppROOT = path.join(path.resolve(__dirname, '..'), 'RsDesktop');

// Express View
app.engine('.html', expressEngine);
app.set('views', path.join(AppROOT, 'src'));
app.set('view engine', 'html');


app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());


// Serve static files
app.use('/assets', express.static(path.join(AppROOT, 'src/assets'), {maxAge: 30}));
app.use(express.static(path.join(AppROOT,'dist/client'), {index: false}));


app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
})


// use indexFile over ngApp only when there is too much load on the server
function indexFile(req, res) {
  // when there is too much load on the server just send
  // the index.html without prerendering for client-only
  res.sendFile('/index.html', {root:  path.join(AppROOT, 'src')});
}



app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(process.env.PORT || 80, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});


var conf = require('./config.json');

var dbCon: RsKnexConnection = new RsKnexConnection(conf.development.db);



new RsSocket(server, dbCon, {});

