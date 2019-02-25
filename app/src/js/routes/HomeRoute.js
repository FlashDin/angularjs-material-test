'use strict';

var mod = angular.module('home.route', []);

mod.config(homeConfigure);

function homeConfigure($urlRouterProvider, $stateProvider) {
    $stateProvider.state('default', {
        url: '/dashboard',
        templateUrl: 'src/templates/dashboard.html',
        controller: 'HomeCtrl',
        controllerAs: 'default'
    })
        .state('tqueries', {
            url: '/tqueries',
            templateUrl: 'src/templates/tqueries/list.html',
            controller: 'TQueriesCtrl',
            controllerAs: 'tqueries'
        })
        .state('ora_tools', {
            url: '/ora_tools',
            templateUrl: 'src/templates/oratools/ora_tools.html',
            controller: 'OraToolsCtrl',
            controllerAs: 'ora_tools'
        })
        .state('rekon', {
            url: '/rekon',
            templateUrl: 'src/templates/rekon/list.html',
            controller: 'RekonCtrl',
            controllerAs: 'rekon'
        });
}

homeConfigure.$inject = ['$urlRouterProvider', '$stateProvider'];

