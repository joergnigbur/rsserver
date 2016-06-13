
var controller = require('../controller/stats.js');
var moment = require('moment');
exports.runTests = function(conf, i18n, dbCon){

	getJobStats(conf, i18n, dbCon);
	
}

function getJobStats(conf, i18n, dbCon){
	
	
	var request = {'filter': {'startDate': '2015-11-30', 'endDate':'2015-11-30' }};
	var method = controller['getJobStats'];
    
	method.apply(this, [conf, i18n, dbCon, request, function (result) {
	
		var success = result.records && result.records[0]['impressionCount'] == 2; 
		console.log("TEST - getJobStats \rResult: "+success);
		
	}]);
	
}