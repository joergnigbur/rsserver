
import express = require('express');
import {RsSocket} from './RsSocket';
import {RsKnexConnection} from './RsKnexConnection';
var md = require('mobile-detect');
var conf = require('./config.json');

var app = express();
var http = require('http').Server(app);
var dbCon: RsKnexConnection = new RsKnexConnection(conf.development.db);

app.use(function (req, res, next) {
   
    if (!app.get('platform')){
        var mDetect: MobileDetect = new md(req.headers['user-agent']);
        app.set('platform', mDetect);
        console.log(mDetect.mobile());
    }
    if (!app.get('db')) {
        app.set('db', dbCon);
    }
    next();

});

new RsSocket(http, dbCon);
http.listen(3000);
app.use('/img', express.static(__dirname+'/img' ));
app.get('/mobile', function (req, res){
    
        app.use('/', express.static(__dirname + '/RsMobile/www'));
   
        res.sendFile(__dirname + '/RsMobile/www/index.html');
});



