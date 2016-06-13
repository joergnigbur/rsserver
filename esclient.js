var elasticSearch = require('elasticsearch');
exports.esclient = function () {
    return new elasticSearch.Client({
        host: 'localhost:9200',
    //    log: 'trace'
    })

}


