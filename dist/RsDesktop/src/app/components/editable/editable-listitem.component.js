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
var moment = require('moment');
var interfaces_1 = require('rscommon/src/interfaces');
var forms_1 = require("@angular/forms");
var EditableListitem = (function () {
    function EditableListitem() {
        this.type = "default";
        this.onComplete = new core_1.EventEmitter();
        this.months = interfaces_1.Months;
        this.dayNames = interfaces_1.DayNames;
        this.editing = false;
        this.original = {};
    }
    EditableListitem.prototype.save = function () {
        if (this.singleItem.valid) {
            this.original = this.model;
            this.onComplete.emit(this.model);
            this.editing = false;
        }
    };
    EditableListitem.prototype.reset = function () {
        this.model = this.original;
    };
    EditableListitem.prototype.setDate = function (date) {
        this.model = date;
    };
    EditableListitem.prototype.getString = function () {
        if (this.type == 'date')
            return moment(this.model).format("DD.MM.YYYY");
        else
            return this.model;
    };
    EditableListitem.prototype.ngOnInit = function () {
        this.original = this.model;
        switch (this.type) {
            case "tel":
                this.singleItem = new forms_1.FormGroup({
                    item: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.pattern(interfaces_1.RegexTelPattern)])
                });
                break;
            case "date":
                this.singleItem = new forms_1.FormGroup({
                    item: new forms_1.FormControl('')
                });
                break;
            default:
                this.singleItem = new forms_1.FormGroup({
                    item: new forms_1.FormControl('', forms_1.Validators.required)
                });
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], EditableListitem.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], EditableListitem.prototype, "model", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], EditableListitem.prototype, "type", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], EditableListitem.prototype, "onComplete", void 0);
    EditableListitem = __decorate([
        core_1.Component({
            selector: 'editable-listitem',
            templateUrl: './editable-listitem.template.html'
        }), 
        __metadata('design:paramtypes', [])
    ], EditableListitem);
    return EditableListitem;
}());
exports.EditableListitem = EditableListitem;
//# sourceMappingURL=editable-listitem.component.js.map