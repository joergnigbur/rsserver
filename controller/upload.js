var base = this;

var fs = require('fs');

module.exports = function (conf) {

    return {
        uploadFile: function uploadFile(req, callBack) {

            var path = conf.rsBaseDir + '/uploadtest/' + req.session.id + '/';
            if (!fs.existsSync(path))
                fs.mkdirSync(path);
            fs.writeFileSync(path + req.files.file.name, req.files.file.data);
            callBack();
        }
    }

}

