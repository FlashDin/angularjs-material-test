'use strict';

var mod = angular.module('home.service', []);

mod.service('HomeService', homeService);

function homeService($http, config) {

}

homeService.$inject = ['$http', 'config'];
