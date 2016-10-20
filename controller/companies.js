var esClient = require('../esclient.js').esclient();
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var md5 = require('md5');
var extend = require('extend');
var jCtrl = require("./jobber.js");
var qx = require('qx');

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}
exports.getTeaserCompanies = function (req, callBack) {

    req.dbCon('startpage_companies AS ag').select('*').then(function (rows) {
        callBack({records: rows, total: rows.length});
    });

}

exports.getJobs = function (req, callBack) {

    req.dbCon("arbeitgeber AS ag").join("auftraege AS a", "ag.id", "a.uniqueid").where("ag.id", req.filter.id).then(function (result) {
        callBack({records: result, total: result.length});
    })


}

exports.saveRemark = function(req, callBack){
    req.dbCon('application_remarks').insert(req.filter.remark).then(function(result){
        req.filter.remark.remark_id = result[0];
        callBack({records: [req.filter.remark]});
    })
}

exports.loginUser = function (req, callBack) {

    var login = req.filter;


    req.dbCon("arbeitgeber").select('*').where({
        email: login.email,
        passwort: md5(login.password)
    }).then(function (result) {

        if (result.length > 0) {

            req.session.user = result[0];
            req.session.user.role = 'unternehmen';
            req.session.save();

            callBack({records: [req.session.user]});

            req.dbCon("arbeitgeber").update("lastVisit", new Date()).where("id", req.session.user.id).then(function (result) {
                console.log(result);
            });
        }
        else {

            callBack({error: true, msg: "Kombination aus Email / Password ungültig."})
        }
    })


}
