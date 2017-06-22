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
var models_1 = require("./models");
var RsFeathersApp = (function () {
    function RsFeathersApp(config) {
        this.app = feathers();
        this.config = config;
        var sequelize = this.getSequelizeConfig(config);
        var jobberModel = models_1.Jobber(sequelize);
        var branchModel = models_1.Branch(sequelize);
        var jobsModel = models_1.Jobs(sequelize);
        var companiesModel = models_1.Companies(sequelize);
        this.app.use(bodyParser.json())
            .configure(rest())
            .configure(socketio(this.socketIoConnector))
            .configure(hooks())
            .use('/api/jobber', service({ Model: jobberModel }))
            .use('/api/branch', service({ Model: branchModel }))
            .use('/api/jobs', service({ Model: jobsModel }))
            .use('/api/companies', service({ Model: companiesModel }))
            .use('/', feathers.static(__dirname))
            .use(handler()).use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "*");
            next();
        })
            .set('debug', config.debug);
        jobberModel.belongsToMany(branchModel, { through: { model: models_1.JobberBranches, unique: false }, foreignKey: 'branch_id' });
        companiesModel.hasMany(jobsModel);
        if (config.debug)
            this.createTestData();
        RsFeathersApp.instance = this;
    }
    RsFeathersApp.prototype.socketIoConnector = function (io) {
        io.on('connection', function (socket) {
            console.log("socket connected", socket.socketId);
        });
    };
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
    RsFeathersApp.prototype.createTestDataForModel = function (model, modelName, jsonFilename) {
        var _this = this;
        return new Promise(function (resolve) {
            model.sync({ force: true }).then(function () {
                var promises = [];
                var items = jsonFile.readFileSync('./src/json/' + jsonFilename + '.json');
                items.forEach(function (data) {
                    promises.push(_this.app.service('api/' + modelName).create(data));
                });
                Promise.all(promises).then(function () {
                    resolve();
                });
            });
        });
    };
    RsFeathersApp.prototype.createTestData = function () {
        var _this = this;
        this.createTestDataForModel(this.getService('/api/branch').Model, 'branch', 'branches').then(function () {
            _this.createTestDataForModel(_this.getService('/api/jobber').Model, 'jobber', 'jobbers').then(function () {
                var jobberService = _this.getService('/api/jobber');
                var branchService = _this.getService('/api/branch');
                branchService.find({ id: 1 }).then(function (branches) {
                    jobberService.find({ id: 1 }).then(function (jobber) {
                        jobber[0].addBranch(branches[0]);
                    });
                });
            });
        });
        this.createTestDataForModel(this.getService('/api/jobs').Model, 'jobs', 'jobs').then(function () {
            Promise.resolve(_this.createTestDataForModel(_this.getService('/api/companies').Model, 'companies', 'companies'));
        });
    };
    return RsFeathersApp;
}());
exports.RsFeathersApp = RsFeathersApp;
//# sourceMappingURL=RsFeathers.js.map