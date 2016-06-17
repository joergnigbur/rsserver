var cCtrl = require(__dirname + '/companies.js');
var kCtrl = require(__dirname + '/keywords.js');
var lCtrl = require(__dirname + '/locations.js');
var caCtrl = require(__dirname + '/categories.js');

var qx = require('qx');
var promiser = require('./promiser.js');

exports.index = function (req, res) {                
    
    qx.map([
        function () { return promiser.toPromise(cCtrl.getTeaserCompanies, req) },
        function () { return promiser.toPromise(lCtrl.getTopLocations, req) },
        function () { return promiser.toPromise(kCtrl.getTopKeywords,req) },
        function () { return promiser.toPromise(caCtrl.getCategories,req) }
    ]).then(function (results) {
        res.render('index', { companies: results[0], locations: results[1], keywords: results[2], categories: results[3] });
    })
        

}

