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

import {Jobber, Branch, Jobs} from './models';

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
        let jobsModel = Jobs(sequelize);

        this.app.use(bodyParser.json())
            .configure(rest())
            .configure(socketio())
            .configure(hooks())
            .use('/api/jobber', service({Model: jobberModel}))
            .use('/api/branch', service({Model: branchModel}))
            .use('/api/jobs', service({Model: jobsModel}))


            .use('/', feathers.static(__dirname))
            .use(handler()).use((req, res, next)=>{
                res.header( "Access-Control-Allow-Origin", "*" );
                res.header("Access-Control-Allow-Credentials", "true");
                res.header("Access-Control-Allow-Headers", "*");
                next();
            })
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

    private createTestDataForModel(model, modelName, jsonFilename){

        return new Promise((resolve)=>{

            model.sync({force: true}).then(() => {

                let items = jsonFile.readFileSync('./src/json/'+jsonFilename+'.json');
                items.forEach(data => {
                    this.app.service('api/'+modelName).create(data)
                })
                resolve();

            });


        })



    }

    private createTestData(){


                this.createTestDataForModel(this.getService('/api/jobber').Model, 'jobber', 'jobbers').then(()=>{
                    Promise.resolve(this.createTestDataForModel(this.getService('/api/branch').Model, 'branch', 'branches'));
                });

                Promise.resolve(this.createTestDataForModel(this.getService('/api/jobs').Model, 'jobs', 'jobs'));






    }



}


