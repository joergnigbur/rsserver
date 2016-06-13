
var moment = require('moment');
var fs = require('fs');
var Entities = require('html-entities').AllHtmlEntities;
var htmlentities = new Entities();
var esClient = require('../esclient.js').esclient();
var base = this;
var exec = require('./exec.js').exec;
var extend = require('extend');
var S = require('string');

exports.exec = function () {
    exec.apply(this, arguments);
}

function getEsJobsQuery(request) {
    var filter = request.filter;
    normalizeFilter(filter);
    var actDate = moment();
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
                                        },
                                        {
                                            "range": {
                                                "last_update": {
                                                    "boost": 5,
                                                    "gte": actDate.format('YYYY-MM-DD')+' 00:00:00'
                                                }
                                            }
                                        },
                                        {
                                            "range": {
                                                "last_update": {
                                                    "boost": 4,
                                                    "gte": actDate.subtract(7, 'days').format('YYYY-MM-DD')+' 00:00:00'
                                                }
                                            }
                                        },
                                        {
                                            "range": {
                                                "last_update": {
                                                    "boost": 3,
                                                    "gte": actDate.subtract(30, 'days').format('YYYY-MM-DD') + ' 00:00:00'
                                                }
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
                                                "active": "1",
                                                "country_id": base.i18n.__('countryId')
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "inner_hits": {
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
    
    if (filter.keyword || filter.location || filter.must)
        queryObj.body.query.has_child.query.filtered.query.bool.must = [];
    
    if (filter.keyword)
        queryObj.body.query.has_child.query.filtered.query.bool.must.push(
            {
                "multi_match": {
                    "query": filter.keyword.toLowerCase(),
                    "fields": [
                        "title",
                        "companyName",
                        "keywords"
                    ]
                }
            });
    if (filter.location && filter.location.stadt && filter.location.stadt!="")
        queryObj.body.query.has_child.query.filtered.query.bool.must.push({
            "term": {
                "locations.name": filter.location.stadt.toLowerCase() 
            }
        });
    if (filter.must)
        queryObj.body.query.has_child.query.filtered.query.bool.must.push(filter.must);
    
    return queryObj;
}

function getEsTotalCountQuery() {
    
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
                                        "country_id": base.i18n.__('countryId')
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
                                        "country_id": base.i18n.__('countryId')
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "size": 1000,
            "from": 0
        }
    }
    return queryObj;
}
function normalizeFilter(filter) {
    for (var prop in filter) {
        prop = prop.toLowerCase();
    }
}

exports.getKeywords = function (request, callBack) {
    esClient.suggest({
        'index': 'recspec',
        'body': {
            "keyword-suggest": {
                "text": request.filter.keyword,
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
                "text": request.filter.location,
                "completion": {
                    "field": "location-suggest"
                }
            }
        }
    }, function (err, data) {
        callBack({ records: data['location-suggest'][0]['options'], totalcount: data['location-suggest'][0]['options'].length });
    })
}


exports.getCategories = function (request, callBack) {
    var esQuery = getEsTotalCountQuery(request);
    
    esClient.search(esQuery, function (err, data) {
        
        base.dbCon('jobtypes').select('*').then(function (rows) {
            callBack({ records: rows, totalcount: data["hits"]["total"] });
        });
    });
}


exports.getJob = function (request, callBack) {
    
    base.dbCon('auftraege as a').select(['a.*', 'ag.id AS cid', 'ag.*']).join('arbeitgeber as ag', 'a.uniqueid', 'ag.id').where('a.id', request.filter.id).then(function (rows) {
        if (rows.length > 0) {
            exports.getJobLocations(request, function (locations) {
                rows[0].locations = locations.records;
                rows[0].jobbeschreibung = htmlentities.decode(rows[0].jobbeschreibung);
                dataBind(rows[0]);
                callBack({ records: rows, totalcount: rows.length });
            });
        }
    });

}

var dataBind = function (row, key) {
    
    row['companyId'] = row.uniqueid;
    if(row.companyUrl && !row.companyUrl.match(/unternehmen/))
        row['companyUrl'] = 'unternehmen-' + encodeURIComponent(row.companyUrl);
    row['joburl'] = encodeURIComponent('job_' + row.titel.split(' ').join('-').replace(/[/-]+/g, '-').toLowerCase() + '-anzeige-' + row.id);
    if (row.is_foreign == 1)
        row['joburl'] = 'ext.php?gotohash=' + row.gotohash;
    
    row.released = moment(row.time).format('DD.MM.YYYY');
    var logoPath = '/img/kundenfotos/' + row.cid + '/logo/';
    var themePath = '/img/kundenfotos/' + row.cid + '/' + row.id + '/';
    var videoPath = '/img/kundenfotos/' + row.cid + '/video/';
    row['logoUrl'] = '';
    row['adtheme'] = '';
    row['video'] = '';
    var shortD = S(row['jobbeschreibung']).decodeHTMLEntities().stripTags().collapseWhitespace().trim().left(500).chompLeft(' ').ensureRight('...');

    row['shortDescr'] = shortD.s;
    if (row.groupname)
        row.firma = row.groupname;
    
    var i = 0;
    row.locationsLabel = base.i18n.__("countryName");
    if (row.locations && row.locations.length > 0) {
        
        if (row.locations.length < 6) {
            row.locations.forEach(function (loc, i) {
                row.locationsLabel += loc.stadt + ', ';
            })
            row.locationsLabel = row.locationsLabel.substring(0, row.locationsLabel.length - 2);
        }

    }
    //  row.joburl = row.titel.split(' ').join('-').replace(/[-]+/g, '-').toLowerCase();
    
    
    if (row['is_foreign'] == 1)
        row['sign_url'] = row['foreign_url'];
    
    function searchFile(path, key, typeRgx) {
        if (fs.existsSync(base.config.baseDir + path)) {
            var files = fs.readdirSync(base.config.baseDir + path);
            files.forEach(function (file) {
                if (file.match(typeRgx) != null) {
                    row[key] = path + file;
                }
            });
        }
    }
    searchFile(logoPath, 'logoUrl', /\.(gif|jpe?g|png|bmp)/i);
    searchFile(themePath, 'adtheme', /\.(gif|jpe?g|png|bmp)/i);
    searchFile(videoPath, 'video', /\.(mpe?g?4?|avi|movi?e?)/i);

}

exports.getJobLocations = function (request, callBack) {
    
    var query = base.dbCon('auftraege as a').select(['p.stadt', 'p.id']).join('job_location as jl', 'a.id', 'jl.jobid').join('plz_de as p', 'jl.plzid', 'p.id').where('a.id', request.filter.id).orderBy('p.stadt');
    if (request.filter.limit > 0)
        query.limit(request.filter.limit);
    
    query.then(function (rows) {
        callBack({ records: rows, totalcount: rows.length });
    });

}
function getFromElasticResult(jobIds, totalCount, callBack, additional) {
    
   // console.log(jobIds);
    
    var query = base.dbCon('joblist AS jl').select(['jl.*', 'jl.uniqueid AS cid', 'ag.url AS companyUrl']).join('arbeitgeber AS ag','jl.uniqueid','ag.id').orderByRaw('jl.is_premium DESC , jl.is_foreign ASC, jl.uniqueid').whereIn('jl.id', jobIds);
   // console.log(query.toString());
    query.then(function (rows) {
        var records = [];
        rows.forEach(function (row, i) {
            
            if (additional) {
                if (additional.groupname)
                    row.firma = additional.groupname;
            }
            row.index = i;
            dataBind(row);

        });
        
        callBack({ records: rows, totalcount: totalCount });
    })
}


exports.getCompanyJobList = function (request, callBack) {
    var query = base.dbCon('arbeitgeber AS ag').select(['ag.*', 'cg.name AS groupname']).leftJoin('company_groups AS cg', 'cg.id', 'ag.company_groupid').where('url', request.filter.keyword).orWhere('cg.name', request.filter.keyword.replace('-', ' ')).orWhere('ag.firma', request.filter.keyword);
    
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
            
            getFromElasticResult(jobIds, data["hits"]["total"], callBack, add);
        });
    })

}

exports.getJobList = function (request, callBack) {
    
    
    var esQuery = getEsJobsQuery(request);
    //console.log(JSON.stringify(esQuery));
    esClient.search(esQuery, function (err, data) {
        
        
        
        
        if (err) {
            console.log(err);
            throw (err);
        }
        var jobIds = []
        data["hits"]["hits"].forEach(function (cJobs, v) {
            cJobs["inner_hits"]["job"]["hits"]["hits"].forEach(function (job) {
                jobIds.push(job["_id"]);
            })
        })
        
        var query = base.dbCon('joblist AS jl').select(['jl.*', 'jl.uniqueid AS cid', 'ag.url AS companyUrl']).join('arbeitgeber AS ag', 'jl.uniqueid', 'ag.id').orderByRaw('jl.is_premium DESC , jl.is_foreign ASC, jl.uniqueid').whereIn('jl.id', jobIds);
   //     console.log(query.toString());
        query.then(function (rows) {
            var records = [];
            var jIds = [];
            var resultJobs = [];
            rows.forEach(function (row) {
             
                if (jIds.indexOf(row.cid) == -1) {
                    dataBind(row);
                    row.index = jIds.length;
                    jIds.push(row.cid);
                    
                    
                    var jobs = [];
                    rows.filter(function (job) {
                        return job.cid == row.cid;
                    }).forEach(function (job) {
                        dataBind(job);
                        jobs.push(extend({}, job, { jobs: [] }));
                    });
                    var addRow = extend({}, row, { jobs: jobs });
                    resultJobs.push(addRow);
                }
                

            });
            
            callBack({ records: resultJobs, totalcount: data["hits"]["total"] });
        })

    });//.exec();

    
    
   
}





