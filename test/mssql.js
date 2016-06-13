var config = require('../config.js').getConfig('');
/*var CUBRID = require('node-cubrid');

var client = CUBRID.createConnection(config.mysql.connection);
client.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log('connection is established');

        client.close(function (err) {
            if (err) {
                throw err;
            } else {            
                console.log('connection is closed');
            }
        });
    }
});*/

var ADODB = require('node-adodb'),
  connection = ADODB.open(config.connectionString);

// 全局调试开关，默认关闭
ADODB.debug = true;

// 不带返回的查询
connection
  .query('SELECT TOP 10 * FROM dbo.cg_01_Ziele')
  .on('done', function (data){
    console.log(JSON.stringify(data));
  })
  .on('fail', function (data){
    // TODO 逻辑处理
  });