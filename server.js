module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "C:\\Projekte\\RecruitmentSpecialist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("@angular/core");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("angular2-universal");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(3);
var card_1 = __webpack_require__(19);
var headbar_component_1 = __webpack_require__(14);
var socket_service_1 = __webpack_require__(17);
var About = (function () {
    function About() {
    }
    return About;
}());
exports.About = About;
var App = (function () {
    function App(service) {
        var self = this;
    }
    App = __decorate([
        core_1.Component({
            moduleId: module.i,
            template: __webpack_require__(10),
            selector: 'app',
            directives: router_1.ROUTER_DIRECTIVES.concat([
                card_1.MdCard,
                headbar_component_1.Headbar
            ]),
            providers: [socket_service_1.SocketService]
        }),
        __param(0, core_1.Inject(socket_service_1.SocketService)), 
        __metadata('design:paramtypes', [Object])
    ], App);
    return App;
}());
exports.App = App;


/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("@angular/router");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_universal_1 = __webpack_require__(1);
var router_1 = __webpack_require__(3);
var common_1 = __webpack_require__(18);
var app_component_1 = __webpack_require__(2);
var app_routes_1 = __webpack_require__(13);
function ngApp(req, res) {
    var baseUrl = '/';
    var url = req.originalUrl || '/';
    var config = {
        directives: [
            app_component_1.App
        ],
        platformProviders: [
            { provide: angular2_universal_1.ORIGIN_URL, useValue: 'http://localhost' },
            { provide: common_1.APP_BASE_HREF, useValue: baseUrl },
        ],
        providers: [
            { provide: angular2_universal_1.REQUEST_URL, useValue: url },
            angular2_universal_1.NODE_HTTP_PROVIDERS,
            router_1.provideRouter(app_routes_1.routes),
            angular2_universal_1.NODE_LOCATION_PROVIDERS
        ],
        async: true,
        preboot: { appRoot: 'app' }
    };
    res.render('index', config);
}
exports.ngApp = ngApp;


/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("angular2-universal/polyfills");

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("body-parser");

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("cookie-parser");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("express");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = "<md-card>\n  <headbar></headbar>\n  <router-outlet></router-outlet>\n</md-card>\n"

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = "<md-toolbar class=\"fill\">\n\n  <h2>Titel</h2>\n\n  <md-toolbar-row>\n    <div class=\"fill\">Was ?</div>\n    <div class=\"fill\">Wo? </div>\n  </md-toolbar-row>\n\n</md-toolbar>\n\n"

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = "<md-card>\n  Startseite\n</md-card>\n\n"

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var home_1 = __webpack_require__(16);
var app_component_1 = __webpack_require__(2);
exports.routes = [
    { path: '', component: home_1.Home },
    { path: 'about', component: app_component_1.About },
    { path: '**', redirectTo: 'home' }
];


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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
var core_1 = __webpack_require__(0);
var toolbar_1 = __webpack_require__(20);
var Headbar = (function () {
    function Headbar() {
    }
    Headbar = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'headbar',
            template: __webpack_require__(11),
            directives: [toolbar_1.MdToolbar]
        }), 
        __metadata('design:paramtypes', [])
    ], Headbar);
    return Headbar;
}());
exports.Headbar = Headbar;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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
var core_1 = __webpack_require__(0);
var Home = (function () {
    function Home() {
    }
    Home = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'home',
            template: __webpack_require__(12)
        }), 
        __metadata('design:paramtypes', [])
    ], Home);
    return Home;
}());
exports.Home = Home;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(15));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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
var core_1 = __webpack_require__(0);
var io = __webpack_require__(21);
var SocketService = (function () {
    function SocketService() {
        if (!SocketService.socket)
            SocketService.socket = io(window.location.host.replace(/:[0-9]+/, ''));
    }
    SocketService.prototype.request = function (controller, action, filter) {
        var reqObj = { controller: controller, action: action, filter: filter };
        var req = SocketService.socket.emit('query', reqObj);
        return new Promise(function (resolve) {
            req.on(action, function (data) {
                resolve(data);
            });
        });
    };
    SocketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SocketService);
    return SocketService;
}());
exports.SocketService = SocketService;


/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("@angular/common");

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = require("@angular2-material/card");

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = require("@angular2-material/toolbar");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("socket.io-client");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";
__webpack_require__(5);
var path = __webpack_require__(9);
var express = __webpack_require__(8);
var bodyParser = __webpack_require__(6);
var cookieParser = __webpack_require__(7);
var core_1 = __webpack_require__(0);
var angular2_universal_1 = __webpack_require__(1);
core_1.enableProdMode();
var app = express();
var ROOT = path.join(path.resolve(__dirname));
app.engine('.html', angular2_universal_1.expressEngine);
app.set('views', path.join(ROOT, 'src'));
app.set('view engine', 'html');
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(ROOT, 'src/assets'), { maxAge: 30 }));
app.use(express.static(path.join(ROOT, 'dist/client'), { index: false }));
var main_node_1 = __webpack_require__(4);
app.get('/', main_node_1.ngApp);
app.get('/about', main_node_1.ngApp);
app.get('/about/*', main_node_1.ngApp);
app.get('/home', main_node_1.ngApp);
app.get('/home/*', main_node_1.ngApp);
function indexFile(req, res) {
    res.sendFile('/index.html', { root: path.join(ROOT, 'src') });
}
app.get('*', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var pojo = { status: 404, message: 'No Content' };
    var json = JSON.stringify(pojo, null, 2);
    res.status(404).send(json);
});
var server = app.listen(process.env.PORT || 80, function () {
    console.log("Listening on: http://localhost:" + server.address().port);
});

/* WEBPACK VAR INJECTION */}.call(exports, "RsDesktop"))

/***/ }
/******/ ]);