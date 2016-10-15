var moment = require('moment');
var fs = require('fs');
var md5 = require('md5');
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var base64 = require('base-64');

exports.exec = function () {
    exec.apply(this, arguments);
}
exports.execSocket = function () {
    execSocket.apply(this, arguments);
}


function normalize(user){
    delete user.pic;
    delete user.email_rep;
    delete user.tel_rep;
    delete user.passwort_rep;
    delete user.role;
    delete user.bdate;
}

function findByEmail(req, callBack) {
    req.dbCon("studenten").select("id").where("email", req.filter.email).then(function (result) {
        callBack(result);
    })
}

exports.logout = function (req, callBack) {

    console.log(req.session);
    delete req.session.user;
    callBack({records: []});

}
exports.getSessionInfo = function (req, callBack) {

    console.log(req.session);
    var user = req.session && req.session.user ? req.session.user : false;
    callBack({records: [user]});

}

exports.loginUser = function (req, callBack) {

    var login = req.filter;



    req.dbCon("studenten").select('*').where({
        email: login.email,
        passwort: md5(login.password)
    }).then(function (result) {

        if (result.length > 0) {

            req.session.user = result[0];
            req.session.user.role = 'jobber';

            bindFiles(req, req.session.user);
            req.session.save();

            console.log(req.session.user);

            callBack({records: [req.session.user]});

            req.dbCon("studenten").update("lastVisit", new Date()).where("id",req.session.user.id).then(function(result){
                console.log(result);
            });
        }
        else {

            callBack({error: true, msg: "Kombination aus Email / Password ungültig."})
        }
    })


}

exports.persistPicture = persistPicture;

function persistPicture(req, pic) {
    var base64Str = pic.src.replace('data:image/gif;base64,', '');
    var path = req.rsBaseDir + '/img/users/' + req.session.user.id;

    if (!fs.existsSync(path))
        fs.mkdirSync(path);

    path += '/foto';

    if (!fs.existsSync(path))
        fs.mkdirSync(path);

    fs.writeFileSync(path + '/' + pic.name, new Buffer(base64Str, 'base64'));
}

function searchFile( path, typeRgx) {
    var foundFiles = [];
    if (fs.existsSync(path)) {
        var files = fs.readdirSync(path);

        files.forEach(function (file) {
            if (file.match(typeRgx) != null) {
                var found = {name: file, src:  path +'/'+ file};
                console.log('FOUND FILE', found);
                foundFiles.push(found);
            }
        });
    }
    return foundFiles;
}

function bindFiles(req, user) {



    var path = req.rsBaseDir + '/img/users/' + user.id+ '/foto';
    console.log("BIND PICTURE",path);
    var pic = searchFile(path, /\.(gif|jpe?g|png|bmp)/i);


    if (pic.length > 0 && fs.existsSync(pic[0].src)) {
        var buffer = fs.readFileSync(pic[0].src);
        pic[0].src = 'data:image/gif;base64,'+ buffer.toString('base64');
            user.pic = pic[0];
    }
    path = req.rsBaseDir + '/img/users/' + user.id+ '/pdf';
    var pdfs = searchFile(path, /\.(pdf)/i);
    user.pdfs = [];

    if (pdfs.length > 0) {
        pdfs.forEach(function (pdf) {
            if(fs.existsSync(pdf.src)) {

                pdf.src = req.rsImgServer + 'img/users/' + user.id+ '/pdf/' + pdf.name;
                user.pdfs.push(pdf);
            }
        })
    }


}


exports.saveUser = function(req, callBack){
    var pic = Object.assign({}, req.filter.pic);
    normalize(req.filter);
    console.log('update', req.filter);
    req.dbCon("studenten").update(req.filter).where("id", req.filter.id).then(callBack);
}


exports.registerUser = function (req, callBack) {

    var user = req.filter.user;
    console.log(req.filter);
    findByEmail(req, function (result) {
        if (result.length > 0) {
            console.log(result);
            callBack({records: [{error: true, msg: "Emailaddresse existiert bereits."}]})
        } else {

            req.filter.passwort = md5(req.filter.passwort);
            var pic = Object.assign({}, req.filter.pic);
            normalize(req.filter);
            req.dbCon("studenten").insert(req.filter).then(function (result) {
                console.log(result);
                req.session.user = req.filter;
                req.session.user.id = result[0];
                req.session.user.role = 'jobber';
                req.session.save();
                persistPicture(req, pic);
                callBack({records: [req.session.user]});
            })
        }
    })

}



