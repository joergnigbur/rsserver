
var moment = require('moment');
var fs = require('fs');

var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;

exports.exec = function () {
    exec.apply(this, arguments);
}

exports.execSocket = function () {
    execSocket.apply(base, arguments);
}

function getTime(request, response){

    response(moment().format('HH:mm:ss'));

}

