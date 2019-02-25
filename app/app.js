(function () {
    'use strict';

    var host = "";
    var port = "";
// Declare app level module which depends on views, and core components
    var mod = angular.module('app', [
        'ui.router',
        'ngCookies',
        'ngMaterial',
        'ngAnimate',
        'ngAria',
        'ngMessages',
        'md.data.table',
        'ngclipboard',
        'monospaced.qrcode',
        'login.route',
        'login.controller',
        'home.route',
        'home.controller',
        'tqueries.controller',
        'oratools.controller',
        'rekon.controller',
        'myApp.version'
    ]);
    mod.run(appRun);
    appRun.$inject = ['$rootScope', '$location', '$cookies', '$http'];

    function appRun($rootScope, $location, $cookies, $http) {
        host = $location.host();
        port = $location.port();
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.get('globals') || {};
        if ($rootScope.globals.uname) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        $rootScope.$on('$locationChangeStart', function (evt, to, params) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            console.log($location.path());
            var loggedIn = $rootScope.globals.uname;
            if (restrictedPage && !loggedIn) {
                $rootScope.globals.isVisibleLogin = true; // false
                // $location.path('/login');
            }
        });
        console.log("app run");
    }

    mod.config(appConfigure);

    function appConfigure($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('orange');
    }

    appConfigure.$inject = ['$mdThemingProvider'];

    mod.constant('config', {
        apiUrl: 'http://localhost:8090',
        apiOraUrl: 'http://localhost:8091',
        baseUrl: '/',
        basePort: ':' + port,
        enableDebug: true
    });

// angular.element(function() {
//     angular.bootstrap(document, ['app','app.home']);
// });

})();
