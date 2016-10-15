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
var user_service_1 = require("../../services/user.service");
var AccountComponent = (function () {
    function AccountComponent(userService) {
        var _this = this;
        this.userService = userService;
        this.userService.requestFromSession().then(function (user) {
            console.log(user);
            if (!user)
                _this.userService.logout();
        });
    }
    AccountComponent = __decorate([
        core_1.Component({
            selector: 'account',
            templateUrl: './account.template.html',
            styleUrls: ['./account.style.scss']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], AccountComponent);
    return AccountComponent;
}());
exports.AccountComponent = AccountComponent;
//# sourceMappingURL=account.component.js.map