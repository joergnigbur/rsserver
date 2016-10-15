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
var upload_service_1 = require("../../services/upload.service");
var user_service_1 = require("../../services/user.service");
var router_1 = require("@angular/router");
var Register = (function () {
    function Register(socketService, uploadService, userService, router) {
        this.socketService = socketService;
        this.uploadService = uploadService;
        this.userService = userService;
        this.router = router;
        this.companies = [];
        this.locations = [];
        var self = this;
    }
    Register.prototype.onSubmit = function () {
        var _this = this;
        this.userService.registerUser().then(function (result) {
            if (result.records[0].error) {
                _this.error = result.records[0].msg;
            }
            else {
                _this.router.navigateByUrl('/account/' + result.records[0].role);
            }
        });
    };
    Register.prototype.onUpload = function ($event) {
        var _this = this;
        this.uploadService.upload($event.target.files).then(function (resp) {
            _this.userService.user.pic.name = resp.name;
            _this.userService.user.pic.src = "data:image/gif;base64," + resp.base64;
        });
    };
    Register.prototype.ngOnInit = function () {
        var self = this;
        this.registerForm = new forms_1.FormGroup({
            vname: new forms_1.FormControl('', forms_1.Validators.required),
            nname: new forms_1.FormControl('', forms_1.Validators.required),
            email: new forms_1.FormControl('', forms_1.Validators.pattern(interfaces_1.RegexEmailPattern)),
            email_rep: new forms_1.FormControl('', forms_1.Validators.required),
            tel: new forms_1.FormControl('', forms_1.Validators.pattern(interfaces_1.RegexTelPattern)),
            tel_rep: new forms_1.FormControl('', forms_1.Validators.required),
            passwort: new forms_1.FormControl('', forms_1.Validators.minLength(6)),
            passwort_rep: new forms_1.FormControl('', forms_1.Validators.required)
        });
    };
    Register = __decorate([
        core_1.Component({
            selector: 'register',
            templateUrl: './register.template.html',
            styleUrls: ['./register.style.scss']
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService, upload_service_1.UploadService, user_service_1.UserService, router_1.Router])
    ], Register);
    return Register;
}());
exports.Register = Register;
//# sourceMappingURL=register.component.js.map