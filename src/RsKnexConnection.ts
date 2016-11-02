
import * as  Knex from 'knex';
export class RsKnexConnection {

    private connection;


    public getConnection() {
        return this.connection;
    }
        
    constructor(dbConf: any) {
        dbConf.connection.timezone = 'utc';
        this.connection = Knex(dbConf);
    }
}



