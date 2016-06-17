
var moment = require('moment');
var fs = require('fs');
var Entities = require('html-entities').AllHtmlEntities;
var htmlentities = new Entities();
var esClient = require('../esclient.js').esclient();
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var extend = require('extend');
var S = require('string');

var kCtrl = require(__dirname + '/keywords.js');
var lCtrl = require(__dirname + '/locations.js');
var caCtrl = require(__dirname + '/categories.js');
var jCtrl = require(__dirname + '/jobs.js');


var qx = require('qx');
var promiser = require('./promiser.js');

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}


exports.index = function (req, res) {
    req.filter = req.params;
    
    
    qx.map([
        function () { return promiser.toPromise(jCtrl.getJob, req) },
        
        function () { return promiser.toPromise(caCtrl.getCategories, req) }

    ]).then(function (results) {
     
        res.render('job', { job: results[0].records[0], categories:results[1] });

    })
                
          
}