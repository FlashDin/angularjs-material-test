'use strict';

var mod = angular.module('tqueries.service', []);

mod.service('TQueriesService', tQueriesService);

function tQueriesService($http, config) {
    this.saveData = function saveData(params) {
        return $http.post(config.apiUrl + '/api/queries', params);
    };
    this.updateData = function updateData(params) {
        return $http.put(config.apiUrl + '/api/queries', params);
    };
    this.deleteData = function deleteData(params) {
        return $http.delete(config.apiUrl + '/api/queries', params);
    };
    this.findAll = function findAll() {
        return $http.get(config.apiUrl + '/api/queries');
    };
}

tQueriesService.$inject = ['$http', 'config'];
