﻿// the polyfills must be the first thing imported in node.js
import 'angular2-universal/polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { expressEngine } from 'angular2-universal';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(__dirname,  "RsDesktop");

// Express View
app.engine('.html', expressEngine);
app.set('views', path.join(ROOT, 'src'));
app.set('view engine', 'html');

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

// Serve static files
app.use('/assets', express.static(path.join(path.join(ROOT, 'src'), 'assets'), {maxAge: 30}));
app.use(express.static(path.join(ROOT,'www'), {index: false}));

import { ngApp } from './RsDesktop/src/main.node';
// Routes with html5pushstate
// ensure routes match client-side-app
app.get('/', ngApp);
app.get('/about', ngApp);
app.get('/about/*', ngApp);
app.get('/home', ngApp);
app.get('/home/*', ngApp);

// use indexFile over ngApp only when there is too much load on the server
function indexFile(req, res) {
    // when there is too much load on the server just send
    // the index.html without prerendering for client-only
    res.sendFile('/index.html', {root: path.join(ROOT,'www')});
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
