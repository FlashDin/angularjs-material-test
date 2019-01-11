'use strict';

var mod = angular.module('tqueries.controller', [
    'tqueries.service'
]);

mod.controller('TQueriesCtrl', tQueriesCtrl);

function tQueriesCtrl($scope, TQueriesService, $timeout, $mdUtil, $log, $mdEditDialog, $q, $mdDialog) {
    $scope.selected = [];
    $scope.limitOptions = [5, 10, 15];
    $scope.options = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
    };
    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };
    $scope.saveData = function (params) {
        TQueriesService.saveData(params)
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
    $scope.updateData = function (params) {
        TQueriesService.updateData(params)
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
    $scope.deleteData = function (params) {
        TQueriesService.deleteData(params[0])
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
    $scope.data = [];
    TQueriesService.findAll()
        .then(function (response) {
            $scope.data = response.data;
            // angular.forEach(response.data, function(value, key) {
            //
            // });
            console.log("status:" + response.status);
        })
        .catch(function (response) {
            console.error('Error findAll:', response.status, response.data);
        })
        .finally(function () {
            console.log("Task Finished.");
        });
    $scope.editComment = function (event, dessert) {
        event.stopPropagation(); // in case autoselect is enabled

        var editDialog = {
            modelValue: dessert.comment,
            placeholder: 'Add a comment',
            save: function (input) {
                if (input.$modelValue === 'Donald Trump') {
                    input.$invalid = true;
                    return $q.reject();
                }
                if (input.$modelValue === 'Bernie Sanders') {
                    return dessert.comment = 'FEEL THE BERN!'
                }
                dessert.comment = input.$modelValue;
            },
            targetEvent: event,
            title: 'Add a comment',
            validators: {
                'md-maxlength': 30
            }
        };

        var promise;

        if ($scope.options.largeEditDialog) {
            promise = $mdEditDialog.large(editDialog);
        } else {
            promise = $mdEditDialog.small(editDialog);
        }

        promise.then(function (ctrl) {
            var input = ctrl.getInput();

            input.$viewChangeListeners.push(function () {
                input.$setValidity('test', input.$modelValue !== 'test');
            });
        });
    };
    $scope.toggleLimitOptions = function () {
        $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
    };
    $scope.getTypes = function () {
        return ['Candy', 'Ice cream', 'Other', 'Pastry'];
    };
    $scope.loadStuff = function () {
        $scope.promise = $timeout(function () {
            // loading
        }, 2000);
    };
    $scope.logItem = function (item) {
        console.log(item.name, 'was selected');
    };
    $scope.logOrder = function (order) {
        console.log('order: ', order);
    };
    $scope.logPagination = function (page, limit) {
        console.log('page: ', page);
        console.log('limit: ', limit);
    };

    // dialog
    $scope.showDialog = function(ev) {
        $mdDialog.show({
            controller: 'TQueriesCtrl',
            templateUrl: 'src/templates/tqueries/tqueries_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };
    $scope.cancelDialog = function() {
        $mdDialog.cancel();
    };
    // dialog
}

tQueriesCtrl.$inject = ['$scope', 'TQueriesService', '$timeout', '$mdUtil', '$log', '$mdEditDialog', '$q', '$mdDialog'];
