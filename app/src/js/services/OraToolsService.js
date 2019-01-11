'use strict';

var mod = angular.module('oratools.service', []);

mod.service('OraToolsService', oraToolsService);

function oraToolsService($http, config) {
    this.findAll = function findAll(params) {
        // var conf = {headers: {'Content-Type': 'application/json'}};
        return $http.post(config.apiOraUrl + '/api/ora/query_select'); // JSON.stringify()
        // return $http({
        //     url: config.apiOraUrl + '/api/ora/query_select',
        //     method: "POST",
        //     params: params
        // });
    };
}

oraToolsService.$inject = ['$http', 'config'];
