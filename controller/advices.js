var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var base = this;

exports.exec = function () {
    exec.apply(base, arguments);
}
exports.execSocket = function () {
    execSocket.apply(base, arguments);
}
base.getAdvices = function (request, callBack) {
    
    var query = this.dbCon;

    query('seo').select(['*']).orderBy('time', 'DESC').limit(20).offset(request.filter.from).then(function (rows) {
        

        callBack({ records: rows, totalcount: rows.length });

        })
  
   
}

base.getAdviceByUrl = function (request, callBack) {

    var query = this.dbCon;

    query('seo').select(['*']).where('page', request.filter.url).then(function (rows) {


        callBack({ records: rows, totalcount: rows.length });

    })


}
base.getAdvice = function (request, callBack) {
    
    var query = this.dbCon;

    query('seo').select(['*']).where('id', request.filter.id).then(function (rows) {
        

        callBack({ records: rows, totalcount: rows.length });

        })
  
   
}