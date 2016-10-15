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
var socket_service_1 = require('rscommon/src/socket.service');
var forms_1 = require("@angular/forms");
var interfaces_1 = require('rscommon/src/interfaces');
var user_service_1 = require("../../services/user.service");
var router_1 = require("@angular/router");
var Login = (function () {
    function Login(socketService, userService, router) {
        this.socketService = socketService;
        this.userService = userService;
        this.router = router;
        this.jobber = { email: "joerg.nigbur@web.de", password: "schnee123" };
        this.company = { email: "", password: "" };
        var self = this;
    }
    Login.prototype.onSubmit = function (role) {
        var _this = this;
        var promise;
        if (role == "jobber")
            promise = this.userService.loginJobber(this.jobber.email, this.jobber.password);
        else
            promise = this.userService.loginJobber(this.company.email, this.company.password);
        promise.then(function (result) {
            if (result.records[0].error) {
                _this.error = result.records[0].msg;
            }
            else {
                _this.router.navigateByUrl('/account/' + role);
            }
            console.log(result);
        });
    };
    Login.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.loginForm = new forms_1.FormGroup({
            email: new forms_1.FormControl('', forms_1.Validators.pattern(interfaces_1.RegexEmailPattern)),
            password: new forms_1.FormControl('', forms_1.Validators.minLength(6)),
        });
        this.loginFormJobber = new forms_1.FormGroup({
            email: new forms_1.FormControl('', forms_1.Validators.pattern(interfaces_1.RegexEmailPattern)),
            password: new forms_1.FormControl('', forms_1.Validators.minLength(6)),
        });
        this.userService.requestFromSession().then(function (user) {
            console.log(user);
            if (user)
                _this.router.navigateByUrl("/account/" + self.userService.user.role);
        });
    };
    Login = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: './login.template.html',
            styleUrls: ['./login.style.scss']
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService, user_service_1.UserService, router_1.Router])
    ], Login);
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=login.component.js.map