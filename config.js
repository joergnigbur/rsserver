var extend = require('extend');
var os = require('os');
var config = {};
config.local = {};
config.prod = {};


config.local.baseDir = 'C:/xampp/htdocs/recspec';
config.prod.baseDir = '/var/www/clients/client0/web1/web/';

config.defaultLocale = 'de';

config.port = 3000;

config.local.domain = 'localhost.recspec.de';

config.prod.domain = 'www.recruitment-specialist.de';

config.prod.mysql = {
  connection: {
    host: 'www.recruitment-specialist.de',
    user: 'recruitment',
    password: 'DykaybUdIEd7',
    database: 'recruitment', 
    debug:false
  },
  client: 'mysql',
    pool: {
        min: 0,
        max: 10
    }
}

config.local.mysql  = {
  connection: {
    host: 'www.recruitment-specialist.de',
    user: 'recruitment',
    password: 'DykaybUdIEd7',
    database: 'recruitment', 

  },
  client: 'mysql',
    pool: {
        min: 0,
        max: 10
    }
}

config.local.mssql  = {
  connection: {
    host: '10.218.252.10',
    user: 'iface',
    password: '4hK7845F',
    database: 'CouplinkCYM'
  },
  client: 'mssql'
}

config.prod.mssql  = {
  connection: {
    host: '10.218.252.10',
    user: 'iface',
    password: '4hK7845F',
    database: 'CouplinkCYM',

  },
  client: 'mssql'
}

config.prod.jtableBaseDir = config.prod.baseDir+'/node/jtablegenerator';
config.local.jtableBaseDir = config.local.baseDir + '/node/jtablegenerator';

/*
config.local.mysql = {
  host: 'meisterbong.selfhost.eu',
  user: 'rstuerk',
  password: 'ALRvpUB84sqjsqDR',
  database: 'rstuerk'
};*/


var getConfig = function (hostname) {

    return os.hostname() == "Joerg-PC" ? extend(true, config, config.local) : extend(true, config, config.prod);

}

exports.getConfig = getConfig;
