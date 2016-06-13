
var extend = require('extend');
var base = this;
var i18n = require('../localization.js').i18n('de');

exports.exec = function (socket, config, dbCon, msg, callBack) {
    
    this.dbCon = dbCon;
    this.config = config;
    
    i18n.setLocale(msg.locale);    
    this.i18n = i18n;
    
    var request = msg.request;
  
    var method = this[request.action];
    method.apply(this, [ request, function (result) {
       
            socket.emit(request.action, extend({ }, result, { scopeId: request.scopeId }));
        }])
}
