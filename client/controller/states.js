var exec = require('./exec.js').exec;
var base = this;

exports.exec = function () {
    exec.apply(base, arguments);
}

base.parseUrl = function (request, callBack) {
    
    var query = this.dbCon;

    query(base.i18n.__('loctable')).select(['stadt','url']).where('stadt', request.filter.location).where('stadt', request.filter.keyword).orWhere('url', request.filter.location).limit(1).then( function (rows) {
        if (rows.length == 0 || request.filter.location == "") {
            rows = [{ stadt: '' }];
        }

        callBack({ records: rows, totalcount: rows.length });

    })
   
}

