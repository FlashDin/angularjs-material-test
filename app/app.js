'use strict';

var host = "";
var port = "";
// Declare app level module which depends on views, and core components
var mod = angular.module('app', [
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'md.data.table',
    'home.route',
    'home.controller',
    'tqueries.controller',
    'oratools.controller',
    'myApp.version'
]);

mod.run(function ($location) {
    host = $location.host();
    port = $location.port();
    console.log("app run");
});

mod.constant('config', {
    apiUrl: 'http://localhost:8090',
    apiOraUrl: 'http://localhost:8091',
    baseUrl: '/',
    basePort: ':' + port,
    enableDebug: true
});

mod.config(appConfigure);

function appConfigure($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange');
}

appConfigure.$inject = ['$mdThemingProvider'];

// angular.element(function() {
//     angular.bootstrap(document, ['app','app.home']);
// });
