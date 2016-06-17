
var moment = require('moment');
var fs = require('fs');
var extend = require('extend');
var base = this;
var exec = require('./exec.js').exec;
var Interval = require('node-interval');
exports.exec = function () {
    exec.apply(this, arguments);
}

function getStatsQuery(db, addWhere, startDate, endDate) {
    
    
    var raw = 'SELECT MAX(date) as date, SUM(visitorCount) as visitorCount , SUM(signCount) as signCount, sum(impressionCount) as impressionCount ' 
                    + 'FROM(select jds.date, count(DISTINCT ip) AS visitorCount, 0 as signCount, ' 
                    + 'count(si.impression_id) as  impressionCount ' 
                    + 'from  job_daily_stat as  jds  ' 
                    + 'left join  stat_impression as  si on  jds.stat_id  =  si.stat_id  ' 
                    + 'and jds.job_id ' + addWhere 
                    + ' group by  jds.date ' 
                    + ' UNION ' 
                    + '(SELECT date(b.time), 0, count(b.id), 0 FROM bewerbung b WHERE jobid ' + addWhere 
                    + ' group by date(b.time))' 
                    + ') AS stats ' 
                    + 'WHERE date BETWEEN \'' + startDate + '\' AND \'' + endDate + '\' ' 
                    + 'group by date ' 
                    + 'order by date asc ';
    
    return db.raw(raw);
}

function addEmptyDays(startDate, endDate, records, pushObj) {
    
    if (!pushObj) pushObj = { 'visitorCount': 0, 'signCount': 0, impressionCount: 0 };
    
    
    var iDays = moment(endDate).diff(moment(startDate), 'days');
    var recordResult = [];
    for (var i = 0; i < iDays; i++) {
        var actDate = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
        var record;
        record = records.filter(function (record) {
            return moment(record.date).format('YYYY-MM-DD') == actDate;
        })
        if (record.length > 0)
            recordResult.push(record[0])
        else
            recordResult.push(extend({}, { date: actDate }, pushObj));

    }
    return recordResult;
}


base.getCompanyStats = function (request, callBack) {
    
    var startDate = request.filter.startDate;
    var endDate = request.filter.endDate;
    
    var query = getStatsQuery(base.dbCon, 'IN(SELECT id FROM auftraege where uniqueid = \'' + request.filter.companyId + '\') ', startDate, endDate);
    console.log(query.toString());
    query.then(function (rows) {
        rows = rows[0];
        rows = addEmptyDays(startDate, endDate, rows);
        callBack({ records: rows, totalcount: rows.length });
             
    })
}


base.getJobStats = function (request, callBack) {
    
    var startDate = request.filter.startDate;
    var endDate = request.filter.endDate;
    
    var query = getStatsQuery(base.dbCon, ' = ' + request.filter.id, startDate, endDate);
    
    console.log(query.toString());
    query.then(function (rows) {
        rows = rows[0];
        rows = addEmptyDays(startDate, endDate, rows);
        callBack({ records: rows, totalcount: rows.length });
             
    })
}

function getReffererStatsQuery(db, startDate, endDate) {
    
    
    var raw = 'select jds.date, count(DISTINCT si.refer_id) AS count , refer ' 
                    + 'from  refer_daily_stat as ' 
                    + "jds  left join  stat_refer as  si on  jds.stat_id  =  si.stat_id  WHERE jds.date BETWEEN '" + startDate + "' AND '" + endDate + "'" 
                    + " group by  jds.date, refer ";
    
    
    return db.raw(raw);
}

base.getReferrerStats = function (request, callBack) {
    
    var startDate = request.filter.startDate;
    var endDate = request.filter.endDate;
    
    var query = getReffererStatsQuery(base.dbCon, startDate, endDate);
    
        console.log(query.toString());
        query.then(function (rows) {
            rows = rows[0];
            var series = [];
            rows.forEach(function (row) {
                row.dayName = moment(row.date).format('dddd[,] DoM');
                if (series.indexOf(row.refer) == -1)
                    series.push(row.refer);
            });
            var rowsNew = [];
            
            
            rows.forEach(function (row) {
                
                var newRow = {};
                newRow.date = row.date;
                rows.filter(function (row1) {
                    return row1.dayName == row.dayName;
                }).forEach(function (row1) {
                    if (row1.refer == "")
                        row1.refer = 'none';
                    newRow[row1.refer] = row1.count;
                })
                rowsNew.push(newRow);
            })
            rows = addEmptyDays(startDate, endDate, rowsNew, { count: 0 });
            callBack({ records: rows, totalcount: rows.length });
        });
       
 
        
        
}
