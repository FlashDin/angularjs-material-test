'use strict';

var mod = angular.module('rekon.service', []);

mod.service('RekonService', tQueriesService);

function tQueriesService($http, config) {
    this.saveData = function saveData(params) {
        return $http.post(config.apiUrl + '/api/rekon', params);
    };
    this.updateData = function updateData(params) {
        return $http.put(config.apiUrl + '/api/rekon', params);
    };
    this.deleteData = function deleteData(params) {
        return $http.delete(config.apiUrl + '/api/rekon/' + params);
    };
    this.findAll = function findAll() {
        return $http.get(config.apiUrl + '/api/rekon');
    };
}

tQueriesService.$inject = ['$http', 'config'];
