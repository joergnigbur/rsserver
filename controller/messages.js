var moment = require('moment');
var fs = require('fs');
var md5 = require('md5');
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var base64 = require('base-64');
var extend = require('extend');
var apCtrl = require('./application.js');

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}


exports.saveMessage = function(req, callBack){

    req.dbCon("messages").insert(req.filter).then(function(result){
        req.filter.role = req.filter.direction == 1 ? 'jobber' : 'unternehmen'
        req.dbCon("messages AS m").join("arbeitgeber AS ag","ag.id","m.company_id").where({'m.id': result[0]}).select(['m.*','ag.firma']).then(function(records){
            base.pushToClient(req.filter, records[0]);
        })



        callBack({records: [{id:result[0]}]});
    })

}
exports.getMessages = function(req, callBack){

    req.dbCon("messages AS m").join("arbeitgeber AS ag","ag.id","m.company_id").where(req.filter).select(['m.*','ag.firma']).then(function(records){
        callBack({records: records});
    })

}



