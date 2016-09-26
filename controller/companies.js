
var esClient = require('../esclient.js').esclient();
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}
exports.getTeaserCompanies = function(req, callBack) {

    req.dbCon('startpage_companies AS ag').select('*').then(function (rows) {
        callBack({records: rows, total: rows.length});
    });

}
