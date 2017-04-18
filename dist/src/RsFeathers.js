"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require('sequelize');
var path = require('path');
var feathers = require("feathers");
var bodyParser = require('body-parser');
var handler = require('feathers-errors/handler');
var rest = require('feathers-rest');
var socketio = require('feathers-socketio');
var service = require('feathers-sequelize');
var hooks = require('feathers-hooks');
var jsonFile = require('jsonfile');
var jobber_1 = require("./models/jobber");
var branch_1 = require("./models/branch");
var RsFeathersApp = (function () {
    function RsFeathersApp(config) {
        this.app = feathers();
        this.config = config;
        var sequelize = this.getSequelizeConfig(config);
        var jobberModel = jobber_1.Jobber(sequelize);
        var branchModel = branch_1.Branch(sequelize);
        this.app.use(bodyParser.json())
            .configure(rest())
            .configure(socketio())
            .configure(hooks())
            .use('/api/jobber', service({
            Model: jobberModel
        }))
            .use('/api/branch', service({
            Model: branch_1.Branch(sequelize)
        }))
            .use('/', feathers.static(__dirname))
            .use(handler())
            .set('debug', config.debug);
        jobberModel.hasMany(branchModel);
        if (config.debug)
            this.createTestData();
        RsFeathersApp.instance = this;
    }
    RsFeathersApp.prototype.getService = function (name) {
        return this.app.service(name);
    };
    RsFeathersApp.getInstance = function () {
        return RsFeathersApp.instance;
    };
    RsFeathersApp.prototype.getSequelizeConfig = function (conf) {
        return new Sequelize(conf.db.connection.database, conf.db.connection.user, conf.db.connection.password, {
            dialect: 'mysql',
            port: 3306,
            host: conf.db.connection.host,
            logging: function () {
                console.log(arguments);
            }
        });
    };
    RsFeathersApp.prototype.createTestData = function () {
        var _this = this;
        this.getService('/api/jobber').Model.sync({ force: true }).then(function () {
            var jobbers = jsonFile.readFileSync('./src/json/jobbers.json');
            jobbers.forEach(function (jobber) {
                _this.app.service('api/jobber').create(jobber);
            });
        });
        this.getService('/api/branch').Model.sync({ force: true }).then(function () {
            var branches = jsonFile.readFileSync('./src/json/branches.json');
            branches.forEach(function (branch) {
                _this.app.service('api/branch').create(branch);
            });
        });
    };
    return RsFeathersApp;
}());
exports.RsFeathersApp = RsFeathersApp;
//# sourceMappingURL=RsFeathers.js.map