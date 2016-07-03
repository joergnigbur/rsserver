var esCtrl = require('./elastic.js');
var esClient = require('../esclient.js').esclient();
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}
exports.getTopLocations = function (req, callBack) {
    
    esCtrl.getToplocations(req, callBack);

}
exports.getLocationByLatLon = function (req, callBack) {
    var lat = parseFloat(req.filter.latitude);
    var lon = parseFloat(req.filter.longitude);
    var fU = 5;
    
    var query = {
        "index": "recspec",
        "body":{
            "query": {

                "filtered": {

                    "query": { "match_all": {} },

                    "filter": {
                        "geo_distance_range": {
                            "from": "01m",
                            "to": "200km",

                            "locations.loc": {
                                "lat": lat,
                                "lon": lon

                            }
                        }


                    }
                }
            },
            "sort": [
                {
                    "_geo_distance": {
                        "locations.loc": {
                            "lat": lat,
                            "lon": lon
                        },
                        "order": "asc",
                        "unit": "km",
                        "distance_type": "plane"
                    }
                }
            ]
        }
    };
    esClient.search(query, function (err, data) {
        var locs = [];
        data["hits"]["hits"].forEach(function (hit) {
            locs.push(hit._source.locations[0]);
        })
        callBack({ records: locs, totalcount: data["hits"]["total"] });
    })

}
exports.getLocationByName = function (req, callBack) {
    
    var name = typeof (req.filter.location) == 'string' ? req.filter.location : req.filter.location.name;
    req.dbCon(req.i18n.__('locTable') + ' AS p').select('*').where('p.stadt', name).then(function (rows) {
        callBack({records: rows, totalcount:1});
    })

}