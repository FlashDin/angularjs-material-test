'use strict';

var mod = angular.module('login.route', []);

mod.config(loginConfigure);

function loginConfigure($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/'); // default route
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'src/templates/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
    });
}

loginConfigure.$inject = ['$urlRouterProvider', '$stateProvider'];

