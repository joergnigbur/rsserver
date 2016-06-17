
var base = this;
var exec = require('./exec.js').exec;

exports.exec = function () {
    exec.apply(this, arguments);
}
var icons = {}

exports.getBranches = function (req, callBack) {
    
    req.dbCon('branches').select('*').then(function (records) {
        
        records.forEach(function (branch) {
            
            branch.key = branch.id;
            branch.name = branch.branch;
            branch.icon = '<i class="material-icons">' + branch.icon + '</i>';
            branch.type = 'branch'

        })
        
        callBack({ records: records, translate: req.i18n.t('multiselect', { returnObjectTrees: true }) });
    })
    
}

