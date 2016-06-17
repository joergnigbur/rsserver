
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
    
    this.dbCon = dbCon;
    this.config = config;
    
    var request = extend({}, msg, config, { dbCon: dbCon });
    
    
    
    var method = this[request.action];
    method.apply(this, [request, function (result) {
            socket.emit(request.action, result);
    }])
}