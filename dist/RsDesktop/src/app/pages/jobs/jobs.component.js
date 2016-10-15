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
var router_1 = require('@angular/router');
var jobs_service_1 = require("../../services/jobs.service");
var Jobs = (function () {
    function Jobs(route, socketService, jobsService) {
        var _this = this;
        this.route = route;
        this.socketService = socketService;
        this.jobsService = jobsService;
        this.locationChanged = new core_1.EventEmitter();
        this.companyJobs = [];
        this.route.params.subscribe(function (params) {
            var keyword = params["keyword"] ? params["keyword"] : undefined;
            var location = params["location"] ? params["location"] : undefined;
            _this.filter = { keyword: keyword, location: location };
            _this.jobsService.setQuery(_this.filter.keyword, _this.filter.location);
            // this.locationChanged.emit({location: this.filter.location});
            _this.load();
        });
    }
    Jobs.prototype.load = function () {
        var _this = this;
        var self = this;
        this.socketService.request('jobs', 'getJobList', this.filter).then(function (jobs) {
            _this.searchTitle = (jobs.search["keyword"] ? jobs.search["keyword"] : "Jobs ") + " ";
            _this.searchTitle += jobs.search["location"] ? "in " + jobs.search["location"] : "";
            self.companyJobs = jobs.records;
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Jobs.prototype, "locationChanged", void 0);
    Jobs = __decorate([
        core_1.Component({
            selector: 'jobs',
            templateUrl: '../../pages/jobs/jobs.template.html',
            styleUrls: ['./jobs.style.scss']
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, socket_service_1.SocketService, jobs_service_1.JobsService])
    ], Jobs);
    return Jobs;
}());
exports.Jobs = Jobs;
//# sourceMappingURL=jobs.component.js.map