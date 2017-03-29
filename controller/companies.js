var esClient = require('../esclient.js').esclient();
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var md5 = require('md5');
var extend = require('extend');
var jCtrl = require("./jobber.js");
var jobCtrl = require("./jobs.js");
var qx = require('qx');
var fs = require('fs');
var oAssign = require('object-assign');
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
exports.bindFiles = bindFiles;
function bindFiles(req, job) {


    var path = req.rsBaseDir + '/img/kundenfotos/' + (job.uniqueid ? job.uniqueid : job.id) + '/' + (job.uniqueid? job.id : 'logo');
    console.log("BIND PICTURE", path);
    var pic = jCtrl.searchFile(path, /\.(gif|jpe?g|png|bmp)/i);


    if (pic.length > 0 && fs.existsSync(pic[0].src)) {
        var buffer = fs.readFileSync(pic[0].src);
         //= buffer.toString('base64');
        pic[0].src = req.rsImgServer + 'img/kundenfotos/' + (job.uniqueid ? job.uniqueid : job.id) + '/' + (job.uniqueid? job.id : 'logo') + '/' + pic[0].name;
        pic[0].thumb = pic[0].src;
        job.pic = pic[0];
    }

}


exports.getJobs = function (req, callBack) {


    req.dbCon("arbeitgeber AS ag").join("auftraege AS a", "ag.id", "a.uniqueid").join("jobtypes AS jt", "a.jobtyp", "jt.id").where("ag.id", req.filter.id).select('a.*','jt.name AS typeName').orderBy('a.time', 'DESC').offset(req.filter.from).limit(req.filter.limit).then(function (result) {
        req.dbCon("auftraege AS a").where("uniqueid", result[0].uniqueid).count('a.id as jobcount').then(function (count) {
            req.filter.id = result[0].id;
            req.filter.limit = 1;
            result.forEach(function (job) {
                jobCtrl.dataBind(req, job);
                bindFiles(req, job);

            })
            jobCtrl.getJobLocations(req, function (locations) {
                if (locations.records.length > 0)
                    result[0].location = locations.records[0];
                //jobCtrl.dataBind(req, result[0]);
                callBack({records: result, totalcount: count[0].jobcount});
            })
        })
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
    var pic = oAssign({}, req.filter.pic);
    var branches = req.filter.branches;
    normalize(req.filter);
    console.log('update', req.filter);
    req.dbCon("arbeitgeber").update(req.filter).where("id", req.filter.id).then(function () {
        req.dbCon('company_branches').delete().where("company_id", req.filter.id).then(function () {

            branches.filter(function (branch) {
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


exports.deleteFile = function (req, callBack) {

    var file = req.filter.file
    var parent = req.filter.parent


    var path = base.config.rsBaseDir + '/img/kundenfotos/' + (!file.isLogo ? parent.uniqueid : parent.id ) + '/' + (!file.isLogo ? parent.id : 'logo')  + '/' + file.name;

    if (fs.existsSync(path))
        fs.unlinkSync(path);

    delete req.session.user.pic;
    req.session.save();
    callBack();

}

exports.persistFile = function (req, callBack) {

    var file = oAssign({}, req.filter.file);
    var additional = req.filter.additional;



    var base64Str = file.base64.replace('data:image/gif;base64,', '');
    var path = base.config.rsBaseDir + '/img/kundenfotos/' + additional.uniqueid;

    var path = base.config.rsBaseDir + '/img/kundenfotos/' + (!file.isLogo ? additional.uniqueid : additional.id );

    if (!fs.existsSync(path))
        fs.mkdirSync(path);

    path += '/' + (!file.isLogo ? additional.id : 'logo');

    if (!fs.existsSync(path))
        fs.mkdirSync(path);
    else {
        var existing = fs.readdirSync(path);
        existing.forEach(function (file) {
            if (fs.lstatSync(path + '/' + file).isFile())
                fs.unlinkSync(path + '/' + file);
        })
    }
    fs.writeFileSync(path + '/' + file.name, new Buffer(base64Str, 'base64'));

    callBack({records: [file]});

}
