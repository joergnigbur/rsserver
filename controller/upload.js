var base = this;

var fs = require('fs');

module.exports = function (conf) {

    return {
        uploadFile: function uploadFile(req, callBack) {
            var type = req.files.file.name.match(/\.(pdf)/i) == null ? "foto" : "pdf"
            if(req.session.user){

                    var relPath = '/img/users/' + req.session.user.id + '/' + type;
                    var path = conf.rsBaseDir + relPath;
                    if (!fs.existsSync(path))
                        fs.mkdirSync(path);
                    fs.writeFileSync(path + "/" + req.files.file.name, req.files.file.data);
                    var cbO = {name:req.files.file.name, src:relPath};
                    if(type=="foto")
                        cbO.base64 =   new Buffer(req.files.file.data).toString("base64");

                    req.session.user.pdfs.push(cbO)
                    req.session.save();

                    callBack(cbO);



            }else {
                callBack({base64: new Buffer(req.files.file.data).toString("base64")});
            }



        }
    }

}

