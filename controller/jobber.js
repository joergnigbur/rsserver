
var moment = require('moment');
var fs = require('fs');

var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;


exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}

function findByEmail(req, callBack){
    req.dbCon("studenten").select("id").where("email", req.filter.email).then(function(result){
        callBack(result);
    })
}

exports.registerUser = function(req, callBack){

    var user = req.filter.user;
    console.log(req.filter);
    findByEmail(req, function(result){
        if(result.length > 0){
            console.log(result);
            callBack({records: [{error:true, msg:"Emailaddresse existiert bereits."}]})
        }else{
            delete req.filter.pic;
            delete req.filter.email_rep;
            delete req.filter.tel_rep;
            req.dbCon("studenten").insert(req.filter).then(function(result){
                console.log(result);
            })
        }
    })

}



