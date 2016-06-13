/* global instance */
/* global connection */

//require('./node_modules/knex-mssql/index.js');

var getConnection = function (dbConf) {

    var instance = require('knex')(dbConf);
    
    instance.provideConnection = function (req, res, next) {

        req.dbCon = instance;
        next();

    }

    return instance;
}
 

exports.getConnection = getConnection;



