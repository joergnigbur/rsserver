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
var Home = (function () {
    function Home(socketService) {
        this.socketService = socketService;
        this.companies = [];
        this.locations = [];
        var self = this;
        this.socketService.request("locations", "getTopLocations").then(function (locations) {
            self.locations = locations.records;
        });
        this.socketService.request("companies", "getTeaserCompanies").then(function (companies) {
            self.companies = companies.records;
        });
    }
    Home = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: './home.template.html',
            styleUrls: ['./home.style.scss'],
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService])
    ], Home);
    return Home;
}());
exports.Home = Home;
//# sourceMappingURL=home.component.js.map