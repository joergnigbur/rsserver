"use strict";
var home_component_1 = require('./pages/home/home.component');
var jobs_component_1 = require('./pages/jobs/jobs.component');
var job_component_1 = require('./pages/job/job.component');
var register_component_1 = require("./pages/register/register.component");
var login_component_1 = require("./pages/login/login.component");
var account_component_1 = require("./pages/account/account.component");
var account_jobber_component_1 = require("./pages/account/jobber/account-jobber.component");
var account_company_component_1 = require("./pages/account/company/account-company.component");
exports.routes = [
    { path: 'client', redirectTo: '', pathMatch: 'full' },
    { path: '', component: home_component_1.Home },
    { path: 'jobs/:keyword', component: jobs_component_1.Jobs },
    { path: 'jobs', component: jobs_component_1.Jobs },
    { path: 'register', component: register_component_1.Register },
    { path: 'login', component: login_component_1.Login },
    { path: ':keyword/in/:location', component: jobs_component_1.Jobs },
    { path: 'job/:joburl', component: job_component_1.Job },
    {
        path: 'account',
        component: account_component_1.AccountComponent,
        children: [
            {
                path: 'jobber',
                component: account_jobber_component_1.JobberAccountComponent
            },
            {
                path: 'unternehmen',
                component: account_company_component_1.CompanyAccountComponent
            }
        ]
    }
];
//# sourceMappingURL=app.routes.js.map