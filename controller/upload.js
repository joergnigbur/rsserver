var base = this;

var fs = require('fs');

module.exports = function (conf) {

    return {
        uploadFile: function uploadFile(req, callBack) {
            var type = req.files.file.name.match(/\.(pdf)/i) == null ? "foto" : "pdf"
            req.session.reload(function(){
                var path = conf.rsBaseDir + '/img/users/' + req.session.user.id + '/' + type;
                if (!fs.existsSync(path))
                    fs.mkdirSync(path);
                fs.writeFileSync(path + "/" + req.files.file.name, req.files.file.data);
                callBack();
            })


        }
    }

}

