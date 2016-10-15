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
var ng2_file_upload_1 = require('ng2-file-upload');
var UploadService = (function () {
    function UploadService() {
        this.api = window.location.protocol + '//' + window.location.hostname + '/upload';
        this.fileUploadService = new ng2_file_upload_1.FileUploader({ url: this.api });
        this.fileUploadService.setOptions({ url: this.api });
    }
    UploadService.prototype.upload = function (files, onProgress) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.fileUploadService.addToQueue(files);
            _this.fileUploadService.onProgressAll = onProgress;
            _this.fileUploadService.onCompleteItem = function (file, resp, status, headers) {
                resolve(JSON.parse(resp));
            };
            _this.fileUploadService.uploadAll();
        });
    };
    UploadService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map