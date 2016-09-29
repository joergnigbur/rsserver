"use strict";
var Knex = require('knex');
var RsKnexConnection = (function () {
    function RsKnexConnection(dbConf) {
        this.connection = Knex(dbConf);
    }
    RsKnexConnection.prototype.getConnection = function () {
        return this.connection;
    };
    return RsKnexConnection;
}());
exports.RsKnexConnection = RsKnexConnection;
