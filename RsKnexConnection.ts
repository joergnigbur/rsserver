
import * as Knex from 'knex';
export class RsKnexConnection {

    private connection: Knex;

    public getConnection(): Knex {
        return this.connection;
    }
        
    constructor(dbConf: Object) {
        this.connection = Knex(dbConf);
    }
}



