"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=RsSycProvider.js.map