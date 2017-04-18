const Sequelize = require('sequelize');
const path = require('path');
import * as feathers from 'feathers';
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const service = require('feathers-sequelize');
const hooks = require('feathers-hooks');
const jsonFile = require('jsonfile');

import {Jobber} from './models/jobber';
import {Branch} from './models/branch';

export class RsFeathersApp{

    private static instance;
    app: any;
    config: any;

    constructor(config){

        this.app = feathers();
        this.config = config;

        let sequelize = this.getSequelizeConfig(config);
        let jobberModel = Jobber(sequelize);
        let branchModel = Branch(sequelize);

        this.app.use(bodyParser.json())
            .configure(rest())
            .configure(socketio())
            .configure(hooks())
            .use('/api/jobber', service({
                Model: jobberModel
            }))
            .use('/api/branch', service({
                Model: Branch(sequelize)
            }))


            .use('/', feathers.static(__dirname))
            .use(handler())
            .set('debug', config.debug);


        jobberModel.hasMany(branchModel);

        if(config.debug)
            this.createTestData();

        RsFeathersApp.instance = this;
    }


    public getService(name: string){
        return this.app.service(name);
    }

    public static getInstance(){
        return RsFeathersApp.instance;
    }

    private getSequelizeConfig(conf){

        return new Sequelize(conf.db.connection.database, conf.db.connection.user, conf.db.connection.password, {
            dialect: 'mysql',
            port: 3306,
            host: conf.db.connection.host,
            logging: function(){
                console.log(arguments);
            }
        });
    }

    private createTestData(){

        this.getService('/api/jobber').Model.sync({force: true}).then(() => {

            let jobbers = jsonFile.readFileSync('./src/json/jobbers.json');
            jobbers.forEach(jobber => {
                this.app.service('api/jobber').create(jobber)
            })
        });

        this.getService('/api/branch').Model.sync({force: true}).then(() => {

            let branches = jsonFile.readFileSync('./src/json/branches.json');
            branches.forEach(branch => {
                this.app.service('api/branch').create(branch)
            })
        });

    }



}


