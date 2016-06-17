
var base = this;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.getCategories = function (req, callBack) {
    
    req.dbCon('jobtypes').select('*').then(function (records){
        
            records.forEach(function (jobType) {

            jobType.key = jobType.url;
            jobType.displayText = jobType.name;
        })
        callBack(records);
        })
    
}
