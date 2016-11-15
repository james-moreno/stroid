var app = angular.module('app', ['ngRoute', 'ngCookies'])
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'client/partials/welcome.html',
            controller: 'IndexController'
        })
})
