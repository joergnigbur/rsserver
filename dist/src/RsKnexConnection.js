"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Knex = require("knex");
var RsKnexConnection = (function () {
    function RsKnexConnection(dbConf) {
        dbConf.connection.timezone = 'utc';
        this.connection = Knex(dbConf);
    }
    RsKnexConnection.prototype.getConnection = function () {
        return this.connection;
    };
    return RsKnexConnection;
}());
exports.RsKnexConnection = RsKnexConnection;
//# sourceMappingURL=RsKnexConnection.js.map