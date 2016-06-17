
var execSocket = require('./exec.js').execSocket;
var S = require('string');


exports.execSocket = function () {
    execSocket.apply(this, arguments);
}

exports.translate = function (req, callBack){
        
    callBack(req.i18n.t(req.route, { returnObjectTrees: true}));

}

