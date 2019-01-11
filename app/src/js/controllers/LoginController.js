'use strict';

var mod = angular.module('login.controller', [
    'login.service'
]);

mod.controller('LoginCtrl', loginCtrl);

function loginCtrl($scope, LoginService) {
    $scope.loginModel = {
        username: '',
        password: ''
    };

    $scope.saveData = function () {
        LoginService.saveData($scope.user.name, $scope.user.email)
            .then(function (response) {
                $scope.data = response.data;
                console.log("status:" + response.status);
            })
            .catch(function (response) {
                console.error('Error saveData:', response.status, response.data);
            })
            .finally(function () {
                console.log("Task Finished.");
            });
    };
    $scope.updateData = function () {
        LoginService.updateData($scope.user.id, $scope.user.name, $scope.user.email)
            .then(function (response) {
                $scope.data = response.data;
                console.log("status:" + response.status);
            })
            .catch(function (response) {
                console.error('Error updateData:', response.status, response.data);
            })
            .finally(function () {
                console.log("Task Finished.");
            });
    };
    $scope.deleteData = function () {
        LoginService.deleteData($scope.user.id)
            .then(function (response) {
                $scope.data = response.data;
                console.log("status:" + response.status);
            })
            .catch(function (response) {
                console.error('Error deleteData:', response.status, response.data);
            })
            .finally(function () {
                console.log("Task Finished.");
            });
    };
    LoginService.findAll()
        .then(function (response) {
            $scope.data = response.data;
            console.log("status:" + response.status);
        })
        .catch(function (response) {
            console.error('Error findAll:', response.status, response.data);
        })
        .finally(function () {
            console.log("Task Finished.");
        });
}

loginCtrl.$inject = ['$scope', 'LoginService'];
