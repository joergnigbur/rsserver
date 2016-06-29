var esCtrl = require('./elastic.js');

var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}
exports.getTopLocations = function (req, callBack) {
    
    esCtrl.getToplocations(req, callBack);

}
exports.getLocationByLatLon = function (req, callBack) {
    var lat = req.filter.lat;
    var lon = req.filter.lon;

        req.dbCon(req.i18n.__('locTable') + ' AS p').select('*').where('latitude', lat).andWhere('longitude',lon).then(function (rows) {
        callBack(rows[0]);
    })

}
exports.getLocationByName = function (req, callBack) {
    
    var name = typeof (req.filter.location) == 'string' ? req.filter.location : req.filter.location.name;
    req.dbCon(req.i18n.t('locTable') + ' AS p').select('*').where('p.stadt', name).then(function (rows){
        callBack(rows[0]);
    })

}