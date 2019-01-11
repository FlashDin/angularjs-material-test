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
    $scope.row = [];
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
    $scope.editRow = function (event, item) {
        // if auto select is enabled you will want to stop the event from propagating
        event
        $mdDialog.show({
            locals: {
                item: item
            }
        });
    };
    // dialog
    $scope.showDialog = function (ev, index) {
        ev.stopPropagation();
        $mdDialog.show({
            templateUrl: 'src/templates/tqueries/tqueries_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: false,
            scope: $scope,
            preserveScope: true,
            locals: {
                index: index
            },
            controller: function ($scope, index) {
                if (index >= 0) {
                    $scope.dialogTitle = "Edit Query";
                    $scope.row = $scope.data[index];
                    $scope.saveData = function () {
                        TQueriesService.updateData($scope.row)
                            .then(function (response) {
                                $scope.res = response.data;
                                console.log("status:" + response.status);
                            })
                            .catch(function (response) {
                                console.error('Error updateData:', response.status, response.data);
                            })
                            .finally(function () {
                                angular.copy($scope.row, $scope.data); // newData, oldData to update
                                console.log("Task Finished.");
                            });
                    };
                } else {
                    $scope.dialogTitle = "Add Query";
                    $scope.row = [];
                    $scope.saveData = function () {
                        TQueriesService.saveData($scope.row)
                            .then(function (response) {
                                $scope.res = response.data;
                                console.log("status:" + response.status);
                            })
                            .catch(function (response) {
                                console.error('Error saveData:', response.status, response.data);
                            })
                            .finally(function () {
                                $scope.data.push($scope.row);
                                console.log("Task Finished.");
                            });
                    };
                }
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.showConfirm = function (ev, index) {
        var confirm = $mdDialog.confirm()
            .title('Yakin hapus data ini ?')
            .textContent('Penghapusan tidak dapat diulangi.')
            .ariaLabel('Confirm')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $scope.data.splice(index, 1);
            console.log("confirm delete");
        }, function () {
            console.log("cancel");
        });
    };
    // dialog
}

tQueriesCtrl.$inject = ['$scope', 'TQueriesService', '$timeout', '$mdUtil', '$log', '$mdEditDialog', '$q', '$mdDialog'];
