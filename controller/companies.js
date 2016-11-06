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

exports.saveRemark = function (req, callBack) {
    req.dbCon('application_remarks').insert(req.filter.remark).then(function (result) {
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
            req.session.user.branches = [];
            req.dbCon.raw("SELECT *, ifnull((SELECT branch_id FROM company_branches WHERE branch_id = b.id AND company_id = '" + req.session.user.id + "'), 0) AS selected FROM branches b").then(function (branches) {

                req.session.user.branches = branches[0];
                req.session.save();

                callBack({records: [req.session.user]});

                req.dbCon("arbeitgeber").update("lastVisit", new Date()).where("id", req.session.user.id).then(function (result) {
                    console.log(result);
                });
            })


        }
        else {

            callBack({error: true, msg: "Kombination aus Email / Password ungültig."})
        }
    })


}

function normalize(user) {
    delete user.pic;
    delete user.email_rep;
    delete user.tel1;
    delete user.tel_rep;
    delete user.passwort_rep;
    delete user.role;
    delete user.bdate;
    delete user.pdfs;
    delete user.active;
    delete user.alter_jahr;
    delete user.alter_monat;
    delete user.alter_tag;
    delete user.nachname;
    delete user.vorname;
    delete user.branches;

}
exports.saveUser = function (req, callBack) {
    var pic = Object.assign({}, req.filter.pic);
    var branches = req.filter.branches;
    normalize(req.filter);
    console.log('update', req.filter);
    req.dbCon("arbeitgeber").update(req.filter).where("id", req.filter.id).then(function () {
        req.dbCon('company_branches').delete().where("company_id", req.filter.id).then(function () {

            branches.filter(function(branch){
                return branch.selected;
            }).forEach(function (branch) {
                req.dbCon("company_branches").insert({company_id: req.filter.id, branch_id: branch.id}).then();
            })

            extend(req.session.user, req.filter);
            req.session.user.branches = branches;
            req.session.save();
            callBack({records: [req.session.user]});


        })

    });
}
