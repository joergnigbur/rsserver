var esCtrl = require('./elastic.js');

var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}
exports.getTopKeywords = function (req, callBack) {

    esCtrl.getTopKeywords(req, callBack);
}
