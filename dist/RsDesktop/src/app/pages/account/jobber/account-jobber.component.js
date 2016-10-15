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
var core_1 = require('@angular/core');
var user_service_1 = require("../../../services/user.service");
var JobberAccountComponent = (function () {
    function JobberAccountComponent(userService) {
        var _this = this;
        this.userService = userService;
        this.selectedTabIndex = 0;
        this.changed = false;
        this.userService.requestFromSession().then(function (user) {
            console.log(user);
            if (!user)
                _this.userService.logout();
        });
    }
    JobberAccountComponent.prototype.save = function (user) {
        Object.assign(this.userService.user, user);
        this.userService.saveUser();
    };
    JobberAccountComponent.prototype.saveBdate = function (user) {
        var date = user.bdate;
        this.userService.user.alter_jahr = date.getUTCFullYear();
        this.userService.user.alter_monat = date.getUTCMonth();
        this.userService.user.alter_tag = date.getUTCDate();
        this.userService.saveUser();
    };
    JobberAccountComponent.prototype.getSelectedTabIndex = function () {
        return this.selectedTabIndex;
    };
    JobberAccountComponent = __decorate([
        core_1.Component({
            selector: 'JobberAccount',
            templateUrl: './account-jobber.template.html',
            styleUrls: ['../account.style.scss']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], JobberAccountComponent);
    return JobberAccountComponent;
}());
exports.JobberAccountComponent = JobberAccountComponent;
//# sourceMappingURL=account-jobber.component.js.map