
var moment = require('moment');
var fs = require('fs');
var Entities = require('html-entities').AllHtmlEntities;
var htmlentities = new Entities();

exports.applyToJob = function (config, db, params, callBack) {
    
    db.query("SELECT *, uniqueid AS cid FROM joblist where id IN ( " + jobIds + " ) ORDER BY is_premium DESC, is_foreign ASC", function (rows) {
        var records = [];
        rows.forEach(function (row, i) {
            dataBind(config, row);
        });
        
        callBack({ records: rows, totalcount: totalCount });
    })
   
}

