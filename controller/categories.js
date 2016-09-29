
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}


exports.getCategories = function (req, callBack) {
    
    req.dbCon('jobtypes').select('*').then(function (records){
        
            records.forEach(function (jobType) {
            jobType.url = "jobs/"+jobType.name.toLowerCase();
            jobType.key = jobType.name.toLowerCase();
            jobType.displayText = jobType.name;
        })
        callBack({records: records, total:records.length});
        })
    
}
