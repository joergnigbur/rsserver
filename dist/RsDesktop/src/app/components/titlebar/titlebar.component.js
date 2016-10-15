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
var Titlebar = (function () {
    function Titlebar() {
        this.title = "";
        this.color = "";
        this.disableCloseBtn = false;
        this.onClose = new core_1.EventEmitter();
    }
    Titlebar.prototype.closeClicked = function () {
        this.onClose.emit();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Titlebar.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Titlebar.prototype, "color", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Titlebar.prototype, "disableCloseBtn", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Titlebar.prototype, "onClose", void 0);
    Titlebar = __decorate([
        core_1.Component({
            selector: 'titlebar',
            templateUrl: './titlebar.template.html',
            styleUrls: ['./titlebar.style.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], Titlebar);
    return Titlebar;
}());
exports.Titlebar = Titlebar;
//# sourceMappingURL=titlebar.component.js.map