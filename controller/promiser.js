var q = require('q');

exports.toPromise = function (fn, args) {
    var deferred = q.defer();
    fn(args, deferred.resolve);
    return deferred.promise;
}