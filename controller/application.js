
var moment = require('moment');
var fs = require('fs');
var Entities = require('html-entities').AllHtmlEntities;
var htmlentities = new Entities();
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var qx = require('qx');
var jCtrl = require("./jobber.js");
var base = this;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}

exports.getAppFiles = function (req, callBack){

    base.dbCon("application_files").where(req.filter).then(function(result){
        callBack({records: result})
    });

}

exports.fetch = function(req, jobberId, companyId, callback){

    var statement = req.dbCon("bewerbung AS b").join("auftraege AS a","a.id","b.jobid").join("arbeitgeber AS c","a.uniqueid","c.id").whereRaw("1=1").select(["b.*","a.titel", "c.firma"]).orderBy("b.time","DESC");
    if(jobberId)
        statement.andWhere("jobberid", jobberId);
    if(companyId)
        statement.andWhere("company_id", companyId);

    statement.then(callback)


}
exports.setRead = function (req, callBack) {
    req.dbCon("bewerbung").update({is_read: 1}).where(req.filter).then(callBack);
}

exports.apply = function (req, callBack) {
    
    var job =  req.filter.job;
    var jobber = req.filter.jobber;
    var selectedFiles = req.filter.selectedFiles;

    var application = {jobId: job.id, jobberid: req.session.user.id, locationid: job.locations[0].id, time: new Date(), text:"", company_id: job.cid}


    req.dbCon("bewerbung").insert(application).then(function(result){
        var statements = [];

        selectedFiles.forEach(function(file){
            statements.push(function(){
                var data = fs.readFileSync(jCtrl.getUserFolder(req, file.name));
                return req.dbCon("application_files").insert({application_id:result[0], filename: file.name, data: data })
            });
        })
        qx.map(statements).then(callBack);

    })




}

exports.getApplicationRemarks = function(req, callBack){

    req.dbCon("application_remarks").where(req.filter).then(function(result){
        callBack({records: result});
    })

}

exports.getApplications = function (req, callBack) {

    var field, id;
    if((id = req.filter.company_id))
        field = "b.company_id";
    else if((id = req.filter.jobberid))
        field = "b.jobberid";

    req.dbCon("bewerbung AS b").join("auftraege AS a", "b.jobid", "a.id").join("studenten AS s", "b.jobberid", "s.id").join("arbeitgeber AS ag", "ag.id", "b.company_id").where(field, id).orderBy("b.TIME", "DESC").select(['s.*', 'b.origin', 'b.time', 'b.id AS bid', 'a.titel', 'b.is_read', 's.id AS sid', 'b.id AS bid', 'ag.firma']).then(function (result) {
        var statements = [];
        var appIds = [];
        result.forEach(function (record) {
            appIds.push(record.bid);
        })

        req.dbCon("application_files AS af").whereIn("application_id", appIds).select(['filename', 'application_id']).then(function (results) {

            results.forEach(function (file) {
                var record = result.filter(function (app) {
                    return app.bid == file.application_id;
                })[0]
                if (!record.pdfs)
                    record.pdfs = [];
                if (!record.pic)
                    record.pic = {};
                if (file.filename.match(/\.(pdf)$/i) != null)
                    record.pdfs.push({name: file.filename, application_id: record.bid});
                else {
                    statements.push(function () {
                        return req.dbCon("application_files").where({
                            application_id: file.application_id,
                            filename: file.filename
                        }).then(function (fData) {
                            record.pic = ({
                                name: file.filename,
                                application_id: record.bid,
                                base64: new Buffer(fData[0].data).toString("base64")
                            });
                        })
                    })
                }

            });
            qx.map(statements).then(function () {
                callBack({records: result, total: result.length});
            })

        });
    })
}
