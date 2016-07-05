var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var base = this;

exports.exec = function () {
    exec.apply(base, arguments);
}
exports.execSocket = function () {
    execSocket.apply(base, arguments);
}
base.parseUrl = function (request, callBack) {
    
    var query = this.dbCon;

    query(base.i18n.__('locTable')).select(['stadt','url']).where('stadt', request.filter.location).limit(1).then( function (rows) {
        if (rows.length == 0)
            rows = [{ stadt: '' }];

        callBack({ records: rows, totalcount: rows.length });

    })
   
}

