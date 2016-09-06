"use strict";
var express = require('express');
var request = require('request');
var ApacheProxy = (function () {
    function ApacheProxy(app) {
        this.app = app;
        this.router = express.Router();
    }
    ;
    ApacheProxy.prototype.applyAjaxProxy = function () {
        var self = this;
        self.router.get('/ajax/*', function (req, res) {
            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var options = {
                url: 'http://localhost.recspec.de' + req.originalUrl,
                method: 'GET',
                headers: headers
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            });
        });
        self.router.post('/ajax/*', function (req, res) {
            var bodyCnt = "";
            req.on('data', function (chunk) {
                bodyCnt += chunk;
            });
            req.on('end', function () {
                var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                var formParts = bodyCnt.split(/&/);
                var data = {};
                formParts.forEach(function (part) {
                    var keyVal = part.split(/=/);
                    data[keyVal[0]] = keyVal[1];
                });
                var options = {
                    url: 'http://localhost' + req.originalUrl,
                    method: 'POST',
                    headers: headers,
                    form: data
                };
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.json(JSON.parse(body));
                    }
                });
            });
        });
        self.app.use(self.router);
    };
    return ApacheProxy;
}());
exports.ApacheProxy = ApacheProxy;
//# sourceMappingURL=apacheproxy.js.map