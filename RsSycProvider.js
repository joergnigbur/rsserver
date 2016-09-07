"use strict";
var Syc = require("syc");
var RsSycProvider = (function () {
    function RsSycProvider() {
    }
    RsSycProvider.prototype.connect = function (socket) {
        Syc.connect(socket);
    };
    RsSycProvider.prototype.syncList = function (name, list) {
        Syc.sync(name, list);
    };
    return RsSycProvider;
}());
exports.RsSycProvider = RsSycProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnNTeWNQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJzU3ljUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUd6QjtJQUFBO0lBV0EsQ0FBQztJQVRVLCtCQUFPLEdBQWQsVUFBZSxNQUF1QjtRQUNsQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxnQ0FBUSxHQUFmLFVBQWdCLElBQVksRUFBRSxJQUFVO1FBRWhDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRTdCLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUMsQUFYRCxJQVdDO0FBWFkscUJBQWEsZ0JBV3pCLENBQUEifQ==