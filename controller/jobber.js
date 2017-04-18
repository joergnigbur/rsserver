var moment = require('moment');
var fs = require('fs');
var md5 = require('md5');
var base = this;
var exec = require('./exec.js').exec;
var execSocket = require('./exec.js').execSocket;
var base64 = require('base-64');
var extend = require('extend');
var apCtrl = require('./application.js');

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
    delete user.pdfs;
    delete user.branches;
}

function findByEmail(req, callBack) {
    req.dbCon("studenten").select("id").where("email", req.filter.email).then(function (result) {
        callBack(result);
    })
}

exports.getApplicationHistory = function(req, callBack){

    apCtrl.fetch(req, req.session.user.id, undefined, function(records){

        callBack({records: records, total:records.length});
    })

}


exports.logout = function (req, callBack) {


    delete req.session.user;
    callBack({records: []});

}
exports.getSessionInfo = function (req, callBack) {


        var user = req.session && req.session.user ? req.session.user : false;
        if(user) {

            if (user.role == 'studenten')
                bindFiles(req, user);
            else
                cCtrl.bindFiles(req, user);
        }
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
            req.session.user.branches = [];
            req.dbCon.raw("SELECT *, ifnull((SELECT branch_id FROM jobber_branches WHERE branch_id = b.id AND jobber_id = '" + req.session.user.id + "'), 0) AS selected FROM branches b").then(function (branches) {

                req.session.user.branches = branches[0];

                bindFiles(req, req.session.user);
                req.session.save();


                callBack({records: [req.session.user]});

            });


        }
        else {

            callBack({error: true, msg: "Kombination aus Email / Password ungültig."})
        }
    })


}

exports.persistPicture = persistPicture;
exports.getUserFolder = getUserFolder;

function getUserFolder(req, fName){
    var id = req.query ? req.query.id : undefined;

    if(!id && req.session.user) {
        id = req.session.user.id;
    }


    var path = base.config.rsBaseDir + '/img/users/' +   id
    if(fName)
        path += (fName.match(/\.(pdf)$/i) == null ? "/foto/" : "/pdf/") + fName
    return path;
}

exports.deletePic = function(req, callBack){
    exports.deleteFile(req, function(){
        delete req.session.user.pic;
        req.session.save();
        callBack();
    })
}

exports.deletePdf =function(req,callBack){
    exports.deleteFile(req, function(){

        var idx = req.session.user.pdfs.indexOf(req.session.user.pdfs.filter(function(pdf){
                return req.filter.filename == pdf.name
        })[0]);
        req.session.user.pdfs.splice(idx,1);
        req.session.save();
        callBack();
    })
}


exports.persistFile = function (req, callBack) {

    var file = Object.assign({}, req.filter.file);

    var isPdf = file.name.match(/\.(pdf)$/i) !=null;

    var parent = req.filter.additional;

    var base64Str = file.base64.replace('data:image/gif;base64,', '');
    var path = base.config.rsBaseDir + '/img/users/' + parent.id;


    if (!fs.existsSync(path))
        fs.mkdirSync(path);

    path+= file.name.match(/\.(pdf)$/i) == null ? '/foto' : '/pdf'

    if (!fs.existsSync(path))
        fs.mkdirSync(path);

    if (!fs.existsSync(path))
        fs.mkdirSync(path);


    var buffer = new Buffer(base64Str, 'base64');
    path += '/'+file.name;

    if (fs.existsSync(path))
        fs.unlinkSync(path)

    fs.writeFileSync(path, buffer);

    if(!isPdf)
        file.src = base.config.rsImgServer + 'img/users/' + parent.id + '/'+file.name
    else
        file.src = "http://recspec.de/img/frontend/pdflogo.png";


    callBack({records: [file]});

}


exports.deleteFile = function(req, callBack){

    var fName = req.filter.file.name;

    var path = getUserFolder(req,fName );
    if(fs.existsSync(path))
        fs.unlinkSync(path);

    callBack();

}

function persistPicture(req, pic) {
    var base64Str = pic.base64.replace('data:image/gif;base64,', '');
    var path = base.config.rsBaseDir + '/img/users/' + req.session.user.id;

    if (!fs.existsSync(path))
        fs.mkdirSync(path);

    path += '/foto';

    if (!fs.existsSync(path))
        fs.mkdirSync(path);
    else{
        var existing = fs.readdirSync(path);
        existing.forEach(function(file){
            if(fs.lstatSync(path + '/' + file).isFile())
            fs.unlinkSync(path + '/' + file);
        })
    }
    fs.writeFileSync(path + '/' + pic.name, new Buffer(base64Str, 'base64'));
    req.session.user.pic = pic;
}

exports.searchFile = searchFile;
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

var cCtrl = require('./companies.js');

exports.bindFiles = bindFiles;
function bindFiles(req, user, subFolder) {


    if(!subFolder)
        subFolder = "users";


    var path = req.rsBaseDir + '/img/users/' + user.id+ '/foto';
    console.log("BIND PICTURE",path);
    var pic = searchFile(path, /\.(gif|jpe?g|png|bmp)/i);


    if (pic.length > 0 && fs.existsSync(pic[0].src)) {
        var buffer = fs.readFileSync(pic[0].src);

       // pic[0].base64 = buffer.toString('base64');

        pic[0].src =  req.rsImgServer + 'img/users/' + user.id+ '/foto/' + pic[0].name;
        pic[0].thumb =  pic[0].src

        user.pic = pic[0];
    }
    path = req.rsBaseDir + '/img/users/' + user.id+ '/pdf';
    var pdfs = searchFile(path, /\.(pdf)/i);
    user.pdfs = [];

    if (pdfs.length > 0) {
        pdfs.forEach(function (pdf) {
            if(fs.existsSync(pdf.src)) {

                pdf.thumb = "http://recspec.de/img/frontend/pdflogo.png";
                pdf.src = req.rsImgServer + 'img/users/' + user.id+ '/pdf/' + pdf.name;
                user.pdfs.push(pdf);
            }
        })
    }
}


exports.saveUser = function(req, callBack){
    var pic = Object.assign({}, req.filter.pic);
    var branches = req.filter.branches;
    normalize(req.filter);
    console.log('update', req.filter);
    req.dbCon("studenten").update(req.filter).where("id", req.filter.id).then(function(){
        req.dbCon('jobber_branches').delete().where("jobber_id", req.filter.id).then(function () {

            branches.filter(function (branch) {
                return branch.selected;
            }).forEach(function (branch) {
                req.dbCon("jobber_branches").insert({jobber_id: req.filter.id, branch_id: branch.id}).then();
            })

            extend(req.session.user, req.filter);
            req.session.user.branches = branches;
            req.session.save();
            callBack({records: [req.session.user]});

        })


        extend(req.session.user, req.filter);
        req.session.save();
        callBack();
    });
}


exports.registerUser = function (req, callBack) {

    var user = req.filter.user;

    findByEmail(req, function (result) {
        if (result.length > 0) {

            callBack({records: [{error: true, msg: "Emailaddresse existiert bereits."}]})
        } else {

            req.filter.passwort = md5(req.filter.passwort);
            var pic = Object.assign({}, req.filter.pic);
            normalize(req.filter);
            req.dbCon("studenten").insert(req.filter).then(function (result) {

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



