var Knex = require('knex');
class RsKnexConnection {
    constructor(dbConf) {
        this.connection = Knex(dbConf);
    }
    getConnection() {
        return this.connection;
    }
}
exports.RsKnexConnection = RsKnexConnection;
//# sourceMappingURL=RsKnexConnection.js.map