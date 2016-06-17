
var esClient = require('../esclient.js').esclient();
var base = this;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.getTeaserCompanies = function(req, callBack) {

    req.dbCon('startpage_companies AS ag').select('*').then(function (rows) {
        callBack(rows);
    });

}
