"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var oAssign = require('object-assign');
var RsResourceServer = (function () {
    function RsResourceServer(conf, app, dbCon) {
        //Fileupload
        var apCtrl = require("../../controller/application.js");
        var jCtrl = require("../../controller/jobber.js");
        var upload = require('../../controller/upload.js')(conf.development);
        app.post('/upload', function (req, res) {
            if (!req["files"]) {
                res.send('No files were uploaded.');
                return;
            }
            upload.uploadFile(req, function (additional) {
                var file = { src: undefined, name: req.files.file.name };
                oAssign(file, additional);
                if (req.files.file.name.match(/\.(pdf)$/i) == null) {
                    //    jCtrl.persistPicture(req, file)
                }
                res.json(file);
            });
        });
        function writeAsImage(res, name, content) {
            res.writeHead(200, {
                'Content-Type': 'image/' + name.match(/\.(jpe?g|png)$/i)[1],
                'Content-Disposition': 'attachment;filename="' + name + '"',
                'Content-Length': content.length
            });
            res.end(content);
        }
        function writeAsPdf(res, name, content) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="' + name + '"',
                'Content-Length': content.length
            });
            res.end(content);
        }
        app.get('/app_endix', function (req, res) {
            var filter = { filter: { application_id: req.query.id, filename: req.query.fname } };
            apCtrl.dbCon = dbCon.getConnection();
            apCtrl.getAppFiles(filter, function (files) {
                if (req.query.fname.match(/\.(pdf)$/i) != null)
                    writeAsPdf(res, req.query.fname, files.records[0].data);
                else
                    writeAsImage(res, req.query.fname, files.records[0].data);
            });
        });
        app.get('/:file(pdf|img)', function (req, res) {
            var path = jCtrl.getUserFolder(req, req.query.fname);
            if (!path) {
                res.write("ERROR - no Session alive");
                res.end();
                return;
            }
            var content = fs.readFileSync(path);
            if (req.params.file == "pdf")
                writeAsPdf(res, req.query.fname, content);
            else
                writeAsImage(res, req.query.fname, content);
        });
    }
    return RsResourceServer;
}());
exports.RsResourceServer = RsResourceServer;
//# sourceMappingURL=RsResourceServer.js.map