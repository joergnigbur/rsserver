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
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var node_1 = require('angular2-universal/node');
var card_1 = require('@angular2-material/card');
var button_1 = require('@angular2-material/button');
var toolbar_1 = require('@angular2-material/toolbar');
var list_1 = require('@angular2-material/list');
var input_1 = require('@angular2-material/input');
var sidenav_1 = require('@angular2-material/sidenav');
var icon_1 = require('@angular2-material/icon');
var grid_list_1 = require('@angular2-material/grid-list');
var tooltip_1 = require('@angular2-material/tooltip');
var tabs_1 = require('@angular2-material/tabs');
var app_component_1 = require('./app/app.component');
var home_component_1 = require('./app/pages/home/home.component');
var jobs_component_1 = require('./app/pages/jobs/jobs.component');
var job_component_1 = require('./app/pages/job/job.component');
var headbar_component_1 = require('./app/components/headbar/headbar.component');
var app_routes_1 = require('./app/app.routes');
var linkbox_component_1 = require('./app/components/linkbox/linkbox.component');
var category_links_component_1 = require("./app/components/category-links/category-links.component");
var titlebar_component_1 = require("./app/components/titlebar/titlebar.component");
var register_component_1 = require("./app/pages/register/register.component");
var account_component_1 = require("./app/pages/account/account.component");
var account_jobber_component_1 = require("./app/pages/account/jobber/account-jobber.component");
var account_company_component_1 = require("./app/pages/account/company/account-company.component");
var equal_validator_directive_1 = require("./app/directives/equal-validator.directive");
var ng2_file_upload_1 = require("ng2-file-upload");
var upload_service_1 = require("./app/services/upload.service");
var user_service_1 = require("./app/services/user.service");
var socket_service_1 = require("rscommon/src/socket.service");
var login_component_1 = require("./app/pages/login/login.component");
var editable_listitem_component_1 = require("./app/components/editable/editable-listitem.component");
var angular2_material_datepicker_1 = require('angular2-material-datepicker');
var ng2_modal_1 = require("ng2-modal");
var jobs_service_1 = require("./app/services/jobs.service");
var filemanager_component_1 = require("./app/components/filemanager/filemanager.component");
var MainModule = (function () {
    function MainModule() {
    }
    MainModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.App],
            declarations: [app_component_1.App, home_component_1.Home, headbar_component_1.Headbar, category_links_component_1.CategoryLinks, linkbox_component_1.Linkbox, jobs_component_1.Jobs, job_component_1.Job, titlebar_component_1.Titlebar, register_component_1.Register, equal_validator_directive_1.EqualValidator, login_component_1.Login, account_component_1.AccountComponent, account_jobber_component_1.JobberAccountComponent, account_company_component_1.CompanyAccountComponent, editable_listitem_component_1.EditableListitem, filemanager_component_1.FilemanagerPage],
            imports: [
                node_1.UniversalModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                angular2_material_datepicker_1.DatepickerModule,
                ng2_modal_1.ModalModule,
                card_1.MdCardModule.forRoot(),
                button_1.MdButtonModule.forRoot(),
                toolbar_1.MdToolbarModule.forRoot(),
                list_1.MdListModule.forRoot(),
                input_1.MdInputModule.forRoot(),
                sidenav_1.MdSidenavModule.forRoot(),
                icon_1.MdIconModule.forRoot(),
                tooltip_1.MdTooltipModule.forRoot(),
                grid_list_1.MdGridListModule.forRoot(),
                tabs_1.MdTabsModule.forRoot(),
                router_1.RouterModule.forRoot(app_routes_1.routes),
                ng2_file_upload_1.FileUploadModule
            ],
            providers: [
                upload_service_1.UploadService,
                socket_service_1.SocketService,
                user_service_1.UserService,
                jobs_service_1.JobsService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], MainModule);
    return MainModule;
}());
exports.MainModule = MainModule;
//# sourceMappingURL=app.node.module.js.map