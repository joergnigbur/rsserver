
var os = require("os");

var config = require('../config.js').getConfig(os.hostname());
var dbCon = require('../db.js').getConnection(config.mysql);

require('./test_controller_stats').runTests(config, {}, dbCon);