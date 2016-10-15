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
var upload_service_1 = require("../../services/upload.service");
var FilemanagerPage = (function () {
    function FilemanagerPage(userService, uploadService, changeRef) {
        this.userService = userService;
        this.uploadService = uploadService;
        this.changeRef = changeRef;
    }
    FilemanagerPage.prototype.addPdf = function (event) {
        if (!event.target.files[0])
            return;
        var self = this;
        var file = event.target.files[0];
        var exFile = this.userService.user.pdfs.filter(function (file) {
            return file.name == name;
        })[0];
        if (!exFile)
            this.userService.user.pdfs.push(file);
        else
            exFile = file;
        this.uploadService.upload([file], function (progress) {
            file.progress = progress;
            self.changeRef.detectChanges();
        });
    };
    FilemanagerPage.prototype.getProgress = function (pdf) {
        return pdf.progress;
    };
    FilemanagerPage.prototype.removePdf = function (pdf) {
        var self = this;
        /*this.userService.deleteFile(pdf.name).then(resolve => {
         let idx = this.userService.user.pdfs.indexOf(pdf);
         self.jobber.pdfs.splice(idx, 1);
         })*/
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], FilemanagerPage.prototype, "show", void 0);
    FilemanagerPage = __decorate([
        core_1.Component({
            selector: "filemanager",
            templateUrl: "./filemanager.template.html",
            styleUrls: ['./filemanager.style.scss']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, upload_service_1.UploadService, core_1.ChangeDetectorRef])
    ], FilemanagerPage);
    return FilemanagerPage;
}());
exports.FilemanagerPage = FilemanagerPage;
//# sourceMappingURL=filemanager.component.js.map