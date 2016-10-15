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
var JobsService = (function () {
    function JobsService() {
        this.query = { keyword: "", location: "" };
        this.listeners = [];
    }
    JobsService.prototype.setQuery = function (keyword, location) {
        this.query = { keyword: ((keyword && keyword != "jobs") ? keyword : ""), location: location ? location : "" };
        this.queryChanged();
    };
    JobsService.prototype.getActiveQuery = function () {
        return this.query;
    };
    JobsService.prototype.queryChanged = function () {
        this.listeners.forEach(function (fn) {
            fn();
        });
    };
    JobsService.prototype.addQueryChangedListener = function (fn) {
        var self = this;
        this.listeners.push(function () {
            fn(self.query);
        });
    };
    JobsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], JobsService);
    return JobsService;
}());
exports.JobsService = JobsService;
//# sourceMappingURL=jobs.service.js.map