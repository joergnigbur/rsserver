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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnNLbmV4Q29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJzS25leENvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUssSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QjtJQVNJLDBCQUFZLE1BQWM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQU5NLHdDQUFhLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUtMLHVCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSx3QkFBZ0IsbUJBWTVCLENBQUEifQ==