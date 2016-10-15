"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var socket_service_1 = require("rscommon/src/socket.service");
var User = (function () {
    function User(opts) {
        this.nachname = "";
        this.vorname = "";
        this.email = "";
        this.email_rep = "";
        this.tel1 = "";
        this.tel_rep = "";
        this.pdfs = [];
        this.alter_tag = "";
        this.alter_monat = "";
        this.alter_jahr = "";
        Object.assign(this, opts);
        for (var k in opts)
            if (this[k])
                this[k] = opts[k];
        this.bdate = this.createBDateObj();
    }
    User.prototype.getBdateString = function () {
        return this.alter_jahr + '-' + this.alter_monat + '-' + this.alter_tag;
    };
    User.prototype.createBDateObj = function () {
        return new Date(this.getBdateString());
    };
    return User;
}());
exports.User = User;
var UserService = (function () {
    function UserService(socketService) {
        this.socketService = socketService;
        this.blankUser = {};
        this.user = new User({});
        this.blankUser = new User({});
    }
    UserService.prototype.getUser = function () {
        return this.user;
    };
    UserService.prototype.requestFromSession = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socketService.request('jobber', 'getSessionInfo', {}).then(function (result) {
                if (result.records[0]) {
                    _this.user = new User(result.records[0]);
                    //Object.assign(this.user, result.records[0]);
                    resolve(_this.user);
                }
                else
                    resolve(null);
            });
        });
    };
    UserService.prototype.saveUser = function (user) {
        return this.socketService.request('jobber', 'saveUser', this.user);
    };
    UserService.prototype.registerUser = function () {
        return this.socketService.request('jobber', 'registerUser', this.user);
    };
    UserService.prototype.logout = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socketService.request('jobber', 'logout').then(function (result) {
                _this.user = new User(_this.blankUser);
                resolve();
            });
        });
    };
    UserService.prototype.loginJobber = function (email, password) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socketService.request('jobber', 'loginUser', { email: email, password: password }).then(function (result) {
                if (!result.records[0].error)
                    _this.user = new User(result.records[0]);
                resolve(result);
            });
        });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_service_1.SocketService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map