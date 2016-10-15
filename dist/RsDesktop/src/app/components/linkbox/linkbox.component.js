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
var Linkbox = (function () {
    function Linkbox() {
        this.title = "";
    }
    Linkbox.prototype.getDisplayText = function (item) {
        return item[this.displayField];
    };
    Linkbox.prototype.getHref = function (item) {
        return item[this.hrefField];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Linkbox.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], Linkbox.prototype, "items", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Linkbox.prototype, "displayField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Linkbox.prototype, "hrefField", void 0);
    Linkbox = __decorate([
        core_1.Component({
            selector: 'link-box',
            templateUrl: './linkbox.template.html',
            styleUrls: ['./linkbox.style.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], Linkbox);
    return Linkbox;
}());
exports.Linkbox = Linkbox;
//# sourceMappingURL=linkbox.component.js.map