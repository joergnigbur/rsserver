import * as express from 'express';
import * as request from 'request';


export class ApacheProxy {
    private router: express.Router;
    private app: express.Express;
    public constructor(app: express.Express) {
        this.app = app;
        this.router = express.Router();
    };
    public applyAjaxProxy(): void{
        var self = this;
        self.router.get('/ajax/*', function (req, res) {

            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };


            var options = {
                url: 'http://localhost.recspec.de' + req.originalUrl,
                method: 'GET',
                headers: headers
            }
            // Start the request

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    res.json(JSON.parse(body));
                }
            })


        })

        self.router.post('/ajax/*', function (req, res) {
            var bodyCnt = "";
            req.on('data', function (chunk) {
                bodyCnt += chunk;
            })
            req.on('end', function () {
                var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                var formParts = bodyCnt.split(/&/);
                var data = {};
                formParts.forEach(function (part) {
                    var keyVal = part.split(/=/);
                    data[keyVal[0]] = keyVal[1];
                })

                var options = {
                    url: 'http://localhost' + req.originalUrl,
                    method: 'POST',
                    headers: headers,
                    form: data
                }
                // Start the request

                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        res.json(JSON.parse(body));
                    }
                })
            })

        })
        self.app.use(self.router);
    }

}
