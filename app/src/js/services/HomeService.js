'use strict';

var mod = angular.module('home.service', []);

mod.service('HomeService', homeService);

function homeService($http, config) {
    this.saveData = function saveData(params) {
        return $http.post(config.apiUrl + '/api/users');
    };
    this.updateData = function updateData(id, name, email) {
        return $http.put(config.apiUrl + '/api/users');
    };
    this.deleteData = function deleteData(id) {
        return $http.delete(config.apiUrl + '/api/users');
    };
    this.findAll = function findAll() {
        return $http.get(config.apiUrl + '/api/users');
    };
}

homeService.$inject = ['$http', 'config'];
