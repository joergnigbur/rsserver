
var esClient = require('../esclient.js').esclient();
var jCtrl = require('./jobs.js');
var base = this;
var S = require('string');
var q = require('q');
var promiser = require('./promiser.js');

base.status = {};

exports.exec = function () {
    exec.apply(this, arguments);
}

exports.getStatus = function () {
    
    return base.status;

}


exports.createIndex = function () {
    
    
    esClient.indices.create({
        "index": "recspec",
        "body":
 {
            "mappings": 
 {
                "company": {
                    "properties": {
                        "group": {
                            "type": "string"
                        },
                        "jobCount": {
                            "type": "integer"
                        },
                        "name": {
                            "type": "string"
                        },
                        "branches": {
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "index": "not_analyzed"
                                },
                                "id": {
                                    "type": "integer"
                                }
                            }
                        }
                    }
                },
                "job": {
                    "_parent": {
                        "type": "company"
                    },
                    "_routing": {
                        "required": true
                    },
                    "properties": {
                        "active": {
                            "type": "integer"
                        },
                        "companyName": {
                            "type": "string"
                        },
                        "country_id": {
                            "type": "integer"
                        },
                        "foreign": {
                            "type": "integer"
                        },
                        "keyword-suggest": {
                            "type": "completion",
                            "analyzer": "simple",
                            "payloads": false,
                            "preserve_separators": true,
                            "preserve_position_increments": true,
                            "max_input_length": 50
                        },
                        "keywords": {
                            "type": "string"
                        },
                        'branchIds': {
                            "type": "integer"
                        },
                        "location-suggest": {
                            "type": "completion",
                            "analyzer": "simple",
                            "payloads": false,
                            "preserve_separators": true,
                            "preserve_position_increments": true,
                            "max_input_length": 50
                        },
                        "locations": {
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "index": "not_analyzed"
                                },
                                "tag": {
                                    "type": "string"
                                },
                                "zip": {
                                    "type": "integer"
                                },
                                "latlon": {
                                    "type" : "geo_point"
                                }

                            }
                        },
                        
                        "premium": {
                            "type": "integer"
                        },
                        "title": {
                            "type": "string"
                        },
                        "shortDescription": {
                            "type": "string",
                            "index": "not_analyzed"
                        }
                    }
                }
            }
        }
    })

    
}

exports.deleteIndex = function (callBack) {
    
    if (!callBack)
        callBack = function () { };
    esClient.indices.delete({ index: 'recspec' }, callBack);

}

exports.recreateIndex = function () {
    exports.deleteIndex(function () {
        exports.createIndex();
    })
}


var getTopTermQuery = function (req, field) {
    
    return {
        "search_type": 'count',
        "index": "recspec",
        "body": {
            
            "query": {
                "match_all": {}
            },
            "aggs": {
                "topLocs": {
                    
                    "significant_terms": {
                        "field": field
                    }
                }
            }
        }
    }
}

function addDisplayText(response) {
    
    response.aggregations.topLocs.buckets.forEach(function (bucket) {
        var F = bucket.key.charAt(0).toUpperCase();
        var f = bucket.key.charAt(0).toLowerCase();
        bucket.url = 'jobs/in/'+ bucket.key.toLowerCase();
        bucket.displayText = F + bucket.key.substr(1);
        bucket.key = bucket.key.toLowerCase();
    })
}

exports.getTopKeywords = function (req, callBack) {
    
    esClient.search(getTopTermQuery(req, 'keyword-suggest'), function (error, response) {
        
        addDisplayText(response);
        callBack(response.aggregations.topLocs.buckets);
        
    })
    

}

exports.getToplocations = function (req, callBack) {
    
    esClient.search(getTopTermQuery(req, 'job.locations.name'), function (error, response) {
        
        addDisplayText(response);
        callBack({records: response.aggregations.topLocs.buckets, total: response.aggregations.topLocs.buckets.length});
        
    })
}



exports.crawl = function (req) {
    
    
    req.dbCon('arbeitgeber').whereRaw('id IN (SELECT uniqueid FROM auftraege) AND is_foreign = 0').select('id').then(function (cs) {
        
        base.status.name = 'crawling';
        base.status.total = cs.length;
        base.status.left = cs.length;
        
        var fns = [];
        cs.forEach(function (c) {
            fns.push(function () {
                return q.all([req.dbCon('auftraege AS job').join('arbeitgeber AS ag', 'ag.id', 'job.uniqueid').leftJoin('company_groups AS cg', 'cg.id', 'ag.company_groupid').select(['job.id', 'cg.name AS group', 'ag.firma', 'job.uniqueid', 'ag.firma', 'job.country_id', 'job.active', 'job.is_premium', 'job.is_foreign', 'job.keyword', 'job.titel', 'job.uniqueid', 'job.jobbeschreibung']).where('job.uniqueid', c.id),
                              req.dbCon('company_branches AS cb').join('branches AS b','cb.branch_id', 'b.id').select(['b.branch', 'b.id']).where('cb.company_id', c.id)]);
            })
        })
        var result = [];
        fns.reduce(function (soFar, f) {
            
            return soFar.then(f).then(function (result) {
                
                if (result[0] && result[0].length > 0 && result[0][0].uniqueid) {
                    
                    
                    var company = result[0];
                    
                    company[0].branches = result[1];
                    
                    
                    base.status.subname = company[0].firma;
                    base.status.left--;
                    base.status.subtotal = result.length;
                    
                    
                    base.status.subtotal--;
                    esClient.index({
                        "index": "recspec",
                        "type": "company",
                        "id": company[0].uniqueid,
                        "body": {
                            "group": company[0].group == null ? company[0].firma : company[0].group,
                            "name": company[0].firma,
                            "branches": company[0].branches
                        }
                    }, function (err, succ) {
                        //   if (err)
                        //     console.log(err);
                        
                        
                        company.forEach(function (job) {
                            req.filter = { id: job.id, limit:1 };
                            jCtrl.getJobLocations(req, function (locations) {
                                job.locations = [];
                                job.keywords = [];
                                var keywordSuggest = [];
                                var locationSuggest = [];
                                var branchIds = [];
                                
                                company[0].branches.forEach(function (branch) { 
                                    branchIds.push(branch.id);
                                })

                                locations.records.forEach(function (loc) {
                                    job.locations.push({ name: loc.stadt, tag: loc.stadt, zip: loc.plz, latlon:loc.latitude+','+loc.longitude });
                                    locationSuggest.push({ input: loc.stadt, output: loc.stadt });
                                })
                                
                                var matches = job.keyword.match(/[A-Za-z0-9ÄÖÜäöüß.']+/);
                                if (matches != null)
                                    matches.forEach(function (word) {
                                        job.keywords.push(word);
                                        keywordSuggest.push({ input: word, output: word });
                                    })
                                
                                
                                esClient.create({
                                    "index": "recspec",
                                    "type": "job",
                                    "id": job.id,
                                    "parent": job.uniqueid,
                                    "body": {
                                        "country_id": job.country_id,
                                        "active": job.active,
                                        
                                        "foreign": job.is_foreign,
                                        "premium": job.is_premium,
                                        "keywords": job.keywords,
                                        "locations": job.locations,
                                        "companyName": job.firma,
                                        "location-suggest": locationSuggest,
                                        "keyword-suggest": keywordSuggest,
                                        "title": job.titel,
                                        'branchIds': branchIds,
                                        "shortDescription": S(job['jobbeschreibung']).decodeHTMLEntities().stripTags().collapseWhitespace().trim().left(500).chompLeft(' ').ensureRight('...').s
                                    }
                                }, function (err, succ) {
                                           // if (err)
                                           //     console.log(err);
                                });
                            })
                              
                        });
                    });
                 
                             
                   
                    
                }
            })
        }, q(result));
    })
        
}
