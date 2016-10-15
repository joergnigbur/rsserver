
import * as  Knex from 'knex';
export class RsKnexConnection {

    private connection;


    public getConnection() {
        return this.connection;
    }
        
    constructor(dbConf: Object) {
        this.connection = Knex(dbConf);
    }
}



