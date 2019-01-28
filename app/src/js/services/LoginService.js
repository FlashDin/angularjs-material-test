'use strict';

var mod = angular.module('login.service', []);

mod.service('LoginService', loginService);

function loginService($http, config) {
    this.dataQr = function dataQr() {
        return $http.get(config.apiUrl + '/api/qr');
    };
    this.checkUserSession = function checkUserSession(params) {
        return $http.get(config.apiUrl + '/api/usersinbrowser/check/' + params.fingerprint);
    };
    this.loginToWeb = function loginToWeb(params) {
        return $http.post(config.apiUrl + '/api/usersinbrowser/login', params);
    };
    this.logoutFromWeb = function logoutFromWeb(params) {
        return $http.post(config.apiUrl + '/api/usersinbrowser/logout', params);
    };
}

loginService.$inject = ['$http', 'config'];
