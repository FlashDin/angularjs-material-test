'use strict';

var mod = angular.module('login.service', []);

mod.service('LoginService', loginService);

function loginService($http, config) {
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

loginService.$inject = ['$http', 'config'];
