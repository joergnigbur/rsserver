
var app = angular.module('app', ['ngRoute']);


app.config(function ($routeProvider) {
    
    $routeProvider.when('/frontpage', {
        templateUrl: 'partials/frontpage.html',
        controller: 'frontpage',
    });

    $routeProvider.otherwise({ redirectTo: 'frontpage' });
});