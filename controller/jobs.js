
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
var bCtrl = require(__dirname + '/branches.js');

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
    req.filter['from'] = req.params.from  ? req.params.from : 0;
    if (req.filter.location) {
        req.filter.location = { name: req.filter.location };
        if (req.filter.distance) {
            req.filter.location.radius = req.filter.distance;
        }
    }
    
    qx.map([
        function () { return promiser.toPromise(exports.getJobList, req) },
        function () { return promiser.toPromise(lCtrl.getTopLocations, req) },
        function () { return promiser.toPromise(kCtrl.getTopKeywords, req) },
        function () { return promiser.toPromise(caCtrl.getCategories, req) }
    ]).then(function (results) {
        
        var matchinfo = (req.filter.keyword ? 'keyword':'');
        matchinfo += (matchinfo && req.filter.location.name) ? '_' : '' + (req.filter.location.name ? 'location' :'');
        matchinfo = matchinfo == '' ? 'all' : matchinfo;
        matchinfo = 'jobs.' + matchinfo;
        var titlePlaceholder = 'title.' + matchinfo;
        res.render('jobs', { companies: results[0], locations: results[1], keywords: results[2], categories: results[3], search: { keyword: req.filter.keyword, location: req.filter.location, matchinfo: matchinfo, titlePlaceholder: titlePlaceholder } });

    })


}



function getEsJobsQuery(request) {
    var filter = request.filter;
    normalizeFilter(filter);
    var queryObj = {
        "index": "recspec",
        "body": {
            "query": {
                "has_child": {
                    "score_mode": "max",
                    "type": "job",
                    "query": {
                        "filtered": {
                            "query": {
                                "bool": {
                                    
                                    "should": [
                                        {
                                            "constant_score": {
                                                "filter": {
                                                    "term": {
                                                        "premium": "1"
                                                    }
                                                }, "boost": 10


                                            }
                                        },
                                        {
                                            "constant_score": {
                                                "filter": {
                                                    "term": {
                                                        "foreign": "0"
                                                    }
                                                }, "boost": 9


                                            }
                                        }
                                    ]
                                }
                            },
                            "filter": {
                                "and": {
                                    "filters": [
                                        {
                                            "term": {
                                                "active": "1"
                                            }
                                        },
                                        {
                                            "term": {
                                                "country_id": request.i18n.__('countryId')
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "inner_hits": {
                        "_source": { "exclude": ["location-suggest"] }, 
                        "size": 3
                    }

                }
            },
            "size": filter.limit && filter.limit > 0 ? filter.limit : 10,
            "from": filter.from,
            "sort": {
                "_score": {
                    "order": "desc"
                }
            }
        }
    }
    
    if (filter.keyword || filter.location || filter.must || filter.branchIds)
        queryObj.body.query.has_child.query.filtered.query.bool.must = [];
    
    if (filter.keyword)
        queryObj.body.query.has_child.query.filtered.query.bool.must.push(
            {
                "multi_match": {
                    "query": filter.keyword,
                    "fields": [
                        "title",
                        "companyName",
                        "keywords"
                    ]
                }
            });
    if (filter.location) {
        if (filter.location.radius) {
            queryObj.body.query.has_child.query.filtered.filter.and.filters.push({
                "geo_distance": {
                    "distance": filter.location.radius + "km",
                    "locations.loc": {
                        "lat": filter.location.latitude,
                        "lon": filter.location.longitude
                    }
                }
            })
        } else {
            
            if (filter.location.name)
                queryObj.body.query.has_child.query.filtered.query.bool.must.push({
                    "match": {
                        "locations.tag": filter.location.name
                    }
                });
        }


    }
    if (filter.must)
        queryObj.body.query.has_child.query.filtered.query.bool.must.push(filter.must);
    
    if (filter.branchIds && filter.branchIds.length > 0)
        queryObj.body.query.has_child.query.filtered.filter = {
            
            terms: {
                branchIds: filter.branchIds
            }
        };
    
    
    return queryObj;
}

function getEsTotalCountQuery(req) {
    
    var queryObj = {
        "index": "recspec",
        "body": {
            "query": {
                "filtered": {
                    "query": {
                        "match_all": {}
                    },
                    "filter": {
                        "and": {
                            "filters": [
                                {
                                    "term": {
                                        "active": 1
                                    }
                                },
                                {
                                    "term": {
                                        "country_id": "65"
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
    return queryObj;
}

function getEsCompanyJobsQuery(request) {
    var filter = request.filter;
    normalizeFilter(filter);
    
    var queryObj = {
        "index": "recspec",
        "body": {
            
            "query": {
                
                "filtered": {
                    "query": {
                        "match_phrase_prefix": {
                            "companyName": filter.keyword
                        }
                         
                    },
                    "filter": {
                        "and": {
                            "filters": [
                                {
                                    "term": {
                                        "active": 1
                                    }
                                },
                                {
                                    "term": {
                                        "foreign": 0
                                    }
                                },
                                {
                                    "term": {
                                        "country_id": "65"
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "size": request.filter.limit,
            "from": request.filter.from
        }
    }
    return queryObj;
}
function normalizeFilter(filter) {
    if (filter.branches && filter.branches.length > 0) {
        filter.branchIds = [];
        filter.branches.forEach(function (branch) {
            filter.branchIds.push(branch.id);
        })
    }
}

exports.getKeywords = function (request, callBack) {
    esClient.suggest({
        'index': 'recspec',
        'body': {
            "keyword-suggest": {
                "text": request.filter.searchText,
                "completion": {
                    "field": "keyword-suggest"
                }
            }
        }
    }, function (err, data) {
        callBack({ records: data['keyword-suggest'][0]['options'], totalcount: data['keyword-suggest'][0]['options'].length });
    })

}
exports.getLocations = function (request, callBack) {
    esClient.suggest({
        'index': 'recspec',
        'body': {
            "location-suggest": {
                "text": request.filter.searchText,
                "completion": {
                    "field": "location-suggest"
                }
            }
        }
    }, function (err, data) {
        
        callBack({ records: data['location-suggest'][0]['options'], totalcount: data['location-suggest'][0]['options'].length } );
    })
}


exports.getCategories = function (request, callBack) {
    var esQuery = getEsTotalCountQuery(request);
    
    esClient.search(esQuery, function (err, data) {
        
        request.dbCon('jobtypes').select('*').then(function (rows) {
            base, callBack({ records: rows, totalcount: data["hits"]["total"] });
        });
    });
}


exports.getJob = function (request, callBack) {
    
    request.dbCon('auftraege as a').select(['a.*', 'ag.id AS cid', 'ag.*', 'a.id AS jobid', 'jt.name AS typeName']).join('jobtypes AS jt', 'a.jobtyp', 'jt.id').join('arbeitgeber as ag', 'a.uniqueid', 'ag.id').where('a.id', request.filter.job).then(function (rows) {
        if (rows.length > 0) {
            exports.getJobLocations(request, function (locations) {
                rows[0].locations = locations.records;
                rows[0].jobbeschreibung = htmlentities.decode(rows[0].jobbeschreibung);
                dataBind(request, rows[0]);
                callBack({ records: rows, totalcount: rows.length });
            });
        }
    });

}

var dataBind = function (req, row, opts) {
    
    

    if (!opts)
        opts = { fileFolder: 'companies' };
    
    if (row.locations) {
        row.fewLocs = [];
        row.locations.forEach(function (loc) {
            if (row.fewLocs.length > 4)
                return;
            row.fewLocs.push(loc);
            
        })
    }
    
    if (row.uniqueid)
        row['companyId'] = row.uniqueid;
    
    if (row.companyUrl && !row.companyUrl.match(/unternehmen/))
        row['companyUrl'] = 'unternehmen-' + encodeURIComponent(row.companyUrl);
    
    if (row.jobid)
        row['id'] = row.jobid;
    
    if (row.title)
        row['joburl'] = encodeURIComponent('job_' + row.title.split(' ').join('-').replace(/[/-]+/g, '-').toLowerCase() + '-anzeige-' + row.id);
    else
        row.title = row.titel;

    if (row.is_foreign)
        row['joburl'] = 'ext.php?gotohash=' + row.gotohash;
    if (row.time)
        row.released = moment(row.time).format('DD.MM.YYYY');
    
    var logoPath = '/img/kundenfotos/' + row.cid + '/logo/';
    var themePath = '/img/kundenfotos/' + row.cid + '/' + row.id+'/';
    var themePathFull = '/images/' + opts.fileFolder + '/' + row.cid + '/' + row.id + '/';
    var videoPath = '/images/' + opts.fileFolder + '/thumbs/' + row.cid + '/video/';
    row['logoUrl'] = '';
    row['adtheme'] = '';
    row['adthemeFull'] = '';
    row['video'] = '';
    
    if (row.jobbeschreibung) {
        var shortD = S(row['jobbeschreibung']).decodeHTMLEntities().stripTags().collapseWhitespace().trim().left(500).chompLeft(' ').ensureRight('...');
        row['shortDescr'] = shortD.s;
    }
    if (row.groupname)
        row.firma = row.groupname;
    
    var i = 0;
    row.locationsLabel = "Deutschland";
    if (row.locations && row.locations.length > 0) {
        
        if (row.locations.length < 6) {
            row.locations.forEach(function (loc, i) {
                row.locationsLabel += loc.stadt + ', ';
            })
            row.locationsLabel = row.locationsLabel.substring(0, row.locationsLabel.length - 2);
        }

    }
    //  row.joburl = row.titel.split(' ').join('-').replace(/[-]+/g, '-').toLowerCase();
    
    
    if (row.is_foreign)
        row['sign_url'] = row['foreign_url'];
    
    function searchFile(path, key, typeRgx) {
        if (fs.existsSync('C:\\xampp\\htdocs\\recspec' + path)) {
            var files = fs.readdirSync('C:\\xampp\\htdocs\\recspec' + path);
            files.forEach(function (file) {
                if (file.match(typeRgx) != null) {
                    row[key] =  path + file;
                }
            });
        }
    }
    searchFile(logoPath, 'logoUrl', /\.(gif|jpe?g|png|bmp)/i);
    searchFile(themePath, 'adtheme', /\.(gif|jpe?g|png|bmp)/i);
    searchFile(themePathFull, 'adthemeFull', /\.(gif|jpe?g|png|bmp)/i);
    searchFile(videoPath, 'video', /\.(mpe?g?4?|avi|movi?e?)/i);
    var themePath = '/img/' + opts.fileFolder + row.cid + '/' + row.id + '/';

    if (row.logoUrl == '')
        row.logoUrl = '/img/recspecLogo.png';

    return row;
}

exports.getJobLocations = function (request, callBack) {
    
    var locTable = request.i18n? request.i18n.__('locTable') : 'plz_de';
    var query = request.dbCon('auftraege as a').select(['p.stadt', 'p.id', 'p.plz', 'p.latitude', 'p.longitude']).join('job_location as jl', 'a.id', 'jl.jobid').join(locTable + ' as p', 'jl.plzid', 'p.id').where('a.id', request.filter.id).orderBy('p.stadt');
    if (request.filter.limit > 0)
        query.limit(request.filter.limit);
    
    query.then(function (rows) {
        callBack({ records: rows, totalcount: rows.length });
    });

}
function getFromElasticResult(req, jobIds, totalCount, callBack, additional) {
    
    console.log(jobIds);
    
    var query = req.dbCon('joblist AS jl').select(['jl.*', 'jl.uniqueid AS cid', 'ag.url AS companyUrl', 'ag.firma AS name', 'jt.name AS typeName']).join('arbeitgeber AS ag', 'jl.uniqueid', 'ag.id').join('auftraege AS a', 'a.id', 'jl.id').join('jobtypes AS jt', 'jt.id', 'a.jobtyp').orderByRaw('jl.is_premium DESC , jl.is_foreign ASC, jl.uniqueid').whereIn('jl.id', jobIds);
    console.log(query.toString());
    query.then(function (rows) {
        var records = [];
        var jobLocsToFetch = rows.length;
        rows.forEach(function (row, i) {
            
            if (additional) {
                if (additional.groupname)
                    row.firma = additional.groupname;
            }
            row.index = i;
            dataBind(req, row);
         
        
                req.filter.id = row.id;
                exports.getJobLocations(req, function (locations) {
                    row.location = locations.records[0];
                    jobLocsToFetch--;
                    if (jobLocsToFetch == 0) {
                        callBack({ records: rows, totalcount: totalCount });
                    }
                })
       

        });
        
     
    })
}




exports.getCompanyJobList = function (request, callBack) {
    var query;
    if (request.filter.companyId)
        query = request.dbCon('arbeitgeber AS ag').select(['ag.*', 'cg.name AS groupname']).leftJoin('company_groups AS cg', 'cg.id', 'ag.company_groupid').where('ag.id', request.filter.companyId);
    else
        query = request.dbCon('arbeitgeber AS ag').select(['ag.*', 'cg.name AS groupname']).leftJoin('company_groups AS cg', 'cg.id', 'ag.company_groupid').where('url', request.filter.keyword).orWhere('cg.name', request.filter.keyword.replace('-', ' ')).orWhere('ag.firma', request.filter.keyword).limit(request.filter.limit).offset(request.filter.from);
    
    query.then(function (rows) {
        
        
        request.filter.keyword = rows[0].firma;
        if (rows[0].groupname != null && rows[0].groupname != '')
            request.filter.keyword = rows[0].groupname;
        var esQuery = getEsCompanyJobsQuery(request);
        
        esClient.search(esQuery, function (err, data) {
            
            //console.log(data)
            
            if (err) {
                console.log(err);
                throw (err);
            }
            var jobIds = [0];
            var add = {};
            data["hits"]["hits"].forEach(function (job, v) {
                jobIds.push(job["_id"]);
                
                
            })
            if (rows.length > 0)
                add.groupname = rows[0].groupname;
            
            getFromElasticResult(request, jobIds, data["hits"]["total"], callBack, add);
            


            
        });
    })

}
exports.getJobsByIdString = function (request, callBack) {
    var jobIds = request.filter.ids;
    getFromElasticResult(request, jobIds, jobIds.length, callBack);
}
exports.getJobList = function (request, callBack) {
    
    var self = this;
    
    function getJobList(request) {
        
        var esQuery = getEsJobsQuery(request);
        console.log(JSON.stringify(esQuery));
        esClient.search(esQuery, function (err, data) {
            
            if (err) {
                console.log(err);
                throw (err);
            }
            
            var cIds = [];
            data.hits.hits.forEach(function (cItem) {
                cIds.push(cItem._id);
            })
            

            
            request.dbCon('company_branches AS cb').join('branches AS b', 'cb.branch_id', 'b.id').whereIn("cb.company_id", cIds).select('*').then(function (branches) {
                
                var companies = [];
                var jobLocsToFetch = 0;
                data.hits.hits.forEach(function (cItem) {
                    var cbranches = branches.filter(function (cb) {
                        return cb.company_id == cItem._id;
                    })
                    var newC = extend({}, { cid: cItem._id, jobs: [], branches: cbranches }, cItem._source);
                    newC = dataBind(request, newC);
                    jobLocsToFetch += cItem.inner_hits.job.hits.hits.length;
                    cItem.inner_hits.job.hits.hits.forEach(function (jItem) {
                        var newJ = extend({}, { id: jItem._id, cid: cItem._id }, jItem._source);
                        dataBind(request, newJ);
                        request.filter.id = newJ.id;
                        request.limit = 1;
                        exports.getJobLocations(request, function (locations) {
                            newJ.location = locations.records[0];
                            jobLocsToFetch--;
                            if (jobLocsToFetch == 0) {
                                callBack({ records: companies, totalcount: data.hits.total, search: { keyword: request.filter.keyword, location: request.filter.location } });
                            }
                        })
                        newC.jobs.push(newJ);
                    })
                    companies.push(newC);
         
                })
                
          
            
            })
            
        });//.exec();
    }
    
    if (request.filter.location) {
        //request.filter.location = { radius: request.filter.distance };
       // lCtrl.getLocationByName(request, function (res) {
         //   request.filter.location.latitude = res.latitude;
      //      request.filter.location.longitude = res.longitude;
            getJobList(request, callBack);
        
        

    } else {
        
        getJobList(request, callBack);
    }


    
    
   
}





