
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}

exports.exec = function () {
    exec.apply(this, arguments);
}
var icons = {}

exports.getBranches = function (req, callBack) {
    
    req.dbCon('branches').select('*').then(function (records) {
        
        records.forEach(function (branch) {
            
            branch.key = branch.id;
            branch.name = branch.branch;
            branch.icon = '<md-icon>' + branch.icon + '</md-icon>';
            branch.type = 'branch'

        })
        
        callBack({ records: records, translate: req.i18n.__('multiselect', { returnObjectTrees: true }) });
    })
    
}

