var esCtrl = require('./elastic.js');

var base = this;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.getTopLocations = function (req, callBack) {
    
    esCtrl.getToplocations(req, callBack);

}

exports.getLocationByName = function (req, callBack) {
    
    var name = typeof (req.filter.location) == 'string' ? req.filter.location : req.filter.location.name;
    req.dbCon(req.i18n.t('locTable') + ' AS p').select('*').where('p.stadt', name).then(function (rows){
        callBack(rows[0]);
    })

}