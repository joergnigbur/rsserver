var esCtrl = require('./elastic.js');

var base = this;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.getTopKeywords = function (req, callBack) {
    
    esCtrl.getTopKeywords(req, callBack);

}
