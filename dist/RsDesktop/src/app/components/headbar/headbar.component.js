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
var router_1 = require('@angular/router');
var jobs_service_1 = require("../../services/jobs.service");
var Headbar = (function () {
    function Headbar(jobsService, router) {
        this.jobsService = jobsService;
        this.router = router;
        var self = this;
        this.filter = this.jobsService.getActiveQuery();
        this.jobsService.addQueryChangedListener(function (query) {
            self.filter = query;
        });
    }
    Headbar.prototype.find = function () {
        var route = "/jobs/" + this.filter.keyword.toLowerCase() + (this.filter.location == "" ? "" : "/in/") + this.filter.location.toLowerCase();
        this.router.navigateByUrl(route);
    };
    Headbar.prototype.ngOnInit = function () {
    };
    Headbar = __decorate([
        core_1.Component({
            selector: 'headbar',
            templateUrl: './headbar.template.html',
            styleUrls: ['./headbar.style.scss'],
        }), 
        __metadata('design:paramtypes', [jobs_service_1.JobsService, router_1.Router])
    ], Headbar);
    return Headbar;
}());
exports.Headbar = Headbar;
//# sourceMappingURL=headbar.component.js.map