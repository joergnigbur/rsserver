
var extend = require('extend');
var base = this;

exports.exec = function (action, req, callBack) {
    
    
    var method = this[action];
    method.apply(this, [req, function (result) {
            
            result.route = req.params.section;
            callBack(result);
        }])
}

exports.execSocket = function (socket, config, dbCon, msg, callBack) {

    this.socket = socket;
    this.dbCon = dbCon;
    this.config = config;
    this.i18n = config.i18n;
    var request = extend({i18n: config.i18n, session: config.session}, {}, msg, config, { dbCon: dbCon });

    var method = this[request.action];
    method.apply(this, [request, function (result) {
        if (msg.scopeId)
            result.scopeId = msg.scopeId;
            socket.emit(request.action, result);
    }])
}