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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBhY2hlcHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGFjaGVwcm94eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxPQUFPLFdBQU0sU0FBUyxDQUFDLENBQUE7QUFDbkMsSUFBWSxPQUFPLFdBQU0sU0FBUyxDQUFDLENBQUE7QUFHbkM7SUFHSSxxQkFBbUIsR0FBb0I7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQyxDQUFDOztJQUNNLG9DQUFjLEdBQXJCO1FBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHO1lBRXpDLElBQUksT0FBTyxHQUFHLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFLENBQUM7WUFHdEUsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLDZCQUE2QixHQUFHLEdBQUcsQ0FBQyxXQUFXO2dCQUNwRCxNQUFNLEVBQUUsS0FBSztnQkFDYixPQUFPLEVBQUUsT0FBTzthQUNuQixDQUFBO1lBR0QsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSTtnQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUV2QyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFBO1FBR04sQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRztZQUMxQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDakIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxLQUFLO2dCQUMxQixPQUFPLElBQUksS0FBSyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFBO1lBQ0YsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsSUFBSSxPQUFPLEdBQUcsRUFBRSxjQUFjLEVBQUUsbUNBQW1DLEVBQUUsQ0FBQztnQkFDdEUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJO29CQUM1QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQTtnQkFFRixJQUFJLE9BQU8sR0FBRztvQkFDVixHQUFHLEVBQUUsa0JBQWtCLEdBQUcsR0FBRyxDQUFDLFdBQVc7b0JBQ3pDLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSxPQUFPO29CQUNoQixJQUFJLEVBQUUsSUFBSTtpQkFDYixDQUFBO2dCQUdELE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUk7b0JBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFFdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9CLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDLENBQUMsQ0FBQTtRQUVOLENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTCxrQkFBQztBQUFELENBQUMsQUFqRUQsSUFpRUM7QUFqRVksbUJBQVcsY0FpRXZCLENBQUEifQ==