
import * as express from 'express';
import {RsSocket} from './RsSocket';
import {RsKnexConnection} from './RsKnexConnection';
import {ApacheProxy} from './apacheproxy';
import * as os from 'os';
var md = require('mobile-detect');
var conf = require('./config.json');
conf = os.hostname().match(/Joerg/) ? conf.development : conf.production;

var app = express();



import * as Http from 'http';
var http: Http.Server = Http.createServer(app);

var dbCon: RsKnexConnection = new RsKnexConnection(conf.db);


app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");


    var mDetect: MobileDetect = new md(req.headers['user-agent']);
    app.set('platform', mDetect);
    console.log(mDetect.mobile());

    if (!app.get('db')) {
        app.set('db', dbCon);
    }

    var cordovaPath = __dirname + "/RsMobile/platforms/browser/www/";
    if (app.get('platform').os() == 'AndroidOs') {
        cordovaPath = __dirname + "/RsMobile/platforms/android/www/";
    }
    

    /*
    app.use('/cordova.js', express.static(cordovaPath + 'cordova.js'));
    app.use('/cordova_plugins.js', express.static(cordovaPath + 'cordova_plugins.js'));
    app.use('/config.xml', express.static(cordovaPath + 'config.xml'));
    app.use('/plugins', express.static(cordovaPath + 'plugins'));
    */
    next();

});

new RsSocket(http, dbCon, conf);
http.listen(3000);

app.use('/', express.static(__dirname + '/RsMobile/www'));
app.use('/img', express.static(conf.rsBaseDir + '\\img'));

let proxy = new ApacheProxy(app);
proxy.applyAjaxProxy();

app.get('/mobile', function (req, res) {

    app.use('/', express.static(__dirname + '/RsMobile/platforms/browser/www'));
    res.sendFile(__dirname + '/RsMobile/platforms/browser/www/index.html');

});



