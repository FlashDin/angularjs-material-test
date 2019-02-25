'use strict';

var mod = angular.module('oratools.service', []);

mod.service('OraToolsService', oraToolsService);

function oraToolsService($http, config) {
    this.findAll = function findAll(params) {
        return $http.post(config.apiOraUrl + '/api/ora/query_select', params); // JSON.stringify()
    };
    this.findTest = function findTest(params) {
        return $http.post(config.apiOraUrl + '/api/ora/query_selecttest', params);
    };
}

oraToolsService.$inject = ['$http', 'config'];
