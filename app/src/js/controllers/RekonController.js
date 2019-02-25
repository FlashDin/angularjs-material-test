'use strict';

var mod = angular.module('rekon.controller', [
    'rekon.service'
]);

mod.controller('RekonCtrl', tQueriesCtrl);

function tQueriesCtrl($scope, RekonService, $timeout, $mdUtil, $log, $mdEditDialog, $q, $mdDialog, $mdToast, $filter) {
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
        filter: '',
        order: 'nameToLower',
        limit: 5,
        page: 1
    };
    $scope.data = [];
    $scope.row = [];
    $scope.findAll = function () {
        RekonService.findAll()
            .then(function (response) {
                $scope.data = response.data;
                $scope.dataCopy = angular.copy($scope.data);
                $scope.counted = $scope.data.length;
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
    };

    // search
    $scope.$watch("searchText", function (query) {
        $scope.promise = $timeout(function () {
            if (query == '') {
                $scope.data = $scope.dataCopy;
                $scope.counted = $scope.data.length;
            } else {
                $scope.data = $filter("filter")($scope.data, query);
                $scope.counted = $filter("filter")($scope.data, query).length;
            }
        }, 2000);
    });
    $scope.show = false;
    $scope.showSearch = function () {
        $scope.show = true;
    };
    $scope.removeFilter = function () {
        $scope.show = false;
        $scope.searchText = '';
    };
    // search
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
        $scope.findAll();
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
    $scope.showDialogSave = function (ev, index) {
        ev.stopPropagation();
        $mdDialog.show({
            templateUrl: 'src/templates/rekon/rekon_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            fullscreen: false,
            scope: $scope,
            preserveScope: true,
            locals: {
                index: (($scope.query.page - 1) * $scope.query.limit) + index
            },
            multiple: true,
            controllerAs: 'RekonCtrl',
            controller: function ($scope, index) {
                $scope.loading = false;
                if (index >= 0) {
                    $scope.dialogTitle = "Edit Query";
                    var rowx = angular.copy($scope.data[index]);
                    $scope.row = rowx;
                    $scope.saveData = function (ev) {
                        var confirm = $mdDialog.confirm()
                            .title('Yakin ubah data ini ?')
                            .textContent('Perubahan tidak dapat diulangi.')
                            .ariaLabel('Confirm')
                            .targetEvent(ev)
                            .multiple(true)
                            .ok('Yes')
                            .cancel('Cancel');
                        $mdDialog.show(confirm).then(function () {
                            $scope.loading = true;
                            RekonService.updateData($scope.row)
                                .then(function (response) {
                                    $scope.res = response.data;
                                    angular.copy($scope.row, $scope.data[index]); // newData, oldData to update
                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent('Data berhasil diubah')
                                            .position('top right')
                                            .hideDelay(2000)
                                    );
                                    $scope.row = [];
                                    console.log("status:" + response.status);
                                })
                                .catch(function (response) {
                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent('Data gagal diubah')
                                            .position('top right')
                                            .hideDelay(2000)
                                    );
                                    console.error('Error updateData:', response.status, response.data);
                                })
                                .finally(function () {
                                    $timeout(function () {
                                        $scope.loading = false;
                                        $scope.cancel();
                                    }, 1000);
                                    console.log("Task Finished.");
                                });
                            console.log("confirm update");
                        }, function () {
                            console.log("cancel");
                        });
                    };
                } else {
                    $scope.dialogTitle = "Add Query";
                    $scope.row = {idQuery: '', queryTitle: '', queryDesc: '', tusers: {idUser: '', uname: ''}};
                    $scope.saveData = function () {
                        $scope.row.tusers.idUser = 1;
                        $scope.loading = true;
                        RekonService.saveData($scope.row)
                            .then(function (response) {
                                $scope.res = response.data;
                                $scope.data.push($scope.row);
                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent('Data berhasil disimpan')
                                        .position('top right')
                                        .hideDelay(2000)
                                );
                                $scope.row = [];
                                console.log("status:" + response.status);
                            })
                            .catch(function (response) {
                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent('Data gagal disimpan')
                                        .position('top right')
                                        .hideDelay(2000)
                                );
                                console.error('Error saveData:', response.status, response.data);
                            })
                            .finally(function () {
                                $timeout(function () {
                                    $scope.loading = false;
                                }, 1000);
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
    $scope.showConfirmDelete = function (ev, index) {
        $scope.loading = false;
        var confirm = $mdDialog.confirm()
            .title('Yakin hapus data ini ?')
            .textContent('Penghapusan tidak dapat diulangi.')
            .ariaLabel('Confirm')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            var idx = (($scope.query.page - 1) * $scope.query.limit) + index;
            var rowx = angular.copy($scope.data[idx]);
            $scope.row = rowx;
            $scope.loading = true;
            RekonService.deleteData($scope.row.idQuery)
                .then(function (response) {
                    $scope.res = response.data;
                    $scope.data.splice(idx, 1);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Data berhasil dihapus')
                            .position('top right')
                            .hideDelay(2000)
                    );
                    $scope.row = [];
                    console.log("status:" + response.status);
                })
                .catch(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Data gagal dihapus')
                            .position('top right')
                            .hideDelay(2000)
                    );
                    console.error('Error deleteData:', response.status, response.data);
                })
                .finally(function () {
                    $timeout(function () {
                        $scope.loading = false;
                    }, 1000);
                    console.log("Task Finished.");
                });
            console.log("confirm delete");
        }, function () {
            console.log("cancel");
        });
    };
    $scope.showDialogTestSelect = function (ev, qry) {
        ev.stopPropagation();
        $mdDialog.show({
            templateUrl: 'src/templates/oratools/ora_testdialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            bindToController: true,
            fullscreen: false,
            scope: $scope,
            preserveScope: true,
            locals: {
                qry: qry
            },
            multiple: true,
            controllerAs: 'RekonCtrl',
            controller: function ($scope, qry) {
                $scope.findTest = function () {
                    $scope.rowx = {query: qry};
                    $scope.res = [];
                    // $scope.keyes = '';
                    RekonService.findTest($scope.rowx)
                        .then(function (response) {
                            $scope.dialogTitle2 = "Test Result : Success";
                            $scope.res = response.data;
                            // $scope.keyes = (Object.keys($scope.res[0]));
                            console.log("status:" + response.status);
                        })
                        .catch(function (response) {
                            $scope.dialogTitle2 = "Test Result : Error";
                            console.error('Error findTest:', response.status, response.data);
                        })
                        .finally(function () {
                            console.log("Task Finished.");
                        });
                };
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
    $scope.showDialogQueryList = function (ev) {
        $mdDialog.show({
            templateUrl: 'src/templates/oratools/rekon_listdialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            bindToController: true,
            fullscreen: false,
            scope: $scope,
            preserveScope: true,
            multiple: true,
            controllerAs: 'RekonCtrl',
            controller: function ($scope) {
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
    // dialog
    // $scope.showActionToast = function () {
    //     var pinTo = 'top right';
    //     var toast = $mdToast.simple()
    //         .textContent('Marked as read')
    //         .action('UNDO')
    //         .highlightAction(true)
    //         .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
    //         .position(pinTo)
    //         .hideDelay(2000);
    //
    //     $mdToast.show(toast).then(function (response) {
    //         if (response == 'ok') {
    //             alert('You clicked the \'UNDO\' action.');
    //         }
    //     });
    // };
    // $scope.closeToast = function () {
    //     $mdToast.hide();
    // };

    // print

    // print
}

tQueriesCtrl.$inject = ['$scope', 'RekonService', '$timeout', '$mdUtil', '$log', '$mdEditDialog', '$q', '$mdDialog', '$mdToast', '$filter'];
