'use strict';

var mod = angular.module('oratools.controller', [
    'oratools.service'
]);

mod.controller('OraToolsCtrl', oraToolsCtrl);

function oraToolsCtrl($scope, OraToolsService, $timeout, $mdUtil, $log, $mdEditDialog, $q, $mdDialog, $mdToast, $filter) {
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
    $scope.findAll = function (params) {
        $scope.rowx = {query: params};
        OraToolsService.findAll($scope.rowx)
            .then(function (response) {
                $scope.data = response.data;
                $scope.dataCopy = angular.copy($scope.data);
                $scope.counted = $scope.data.length;
                if ($scope.counted <= 0) {
                    $scope.res = "Data tidak ditemukan";
                }
                // angular.forEach(response.data, function(value, key) {
                //
                // });
                console.log("status:" + response.status);
            })
            .catch(function (response) {
                $scope.data = [];
                $scope.res = "Error";
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
        $scope.cmbSearch = '';
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
                    return dessert.comment = 'FEEL THE BERN!';
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
    $scope.loadStuff = function (params) {
        $scope.data = [];
        $scope.findAll(params);
        $scope.promise = $timeout(function () {

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

    // tabs
    var tabs = [
            {title: 'Result', content: "HEHE"}
        ],
        selected = null,
        previous = null;
    $scope.tabs = tabs;
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function (current, old) {
        previous = selected;
        selected = tabs[current];
        if (old + 1 && (old !== current)) {
            $log.debug('Goodbye ' + previous.title + '!');
        }
        if (current + 1) {
            $log.debug('Hello ' + selected.title + '!');
        }
    });
    $scope.addTab = function (title, view) {
        view = view || title + " Content View";
        tabs.push({title: title, content: view, disabled: false});
    };
    $scope.removeTab = function (tab) {
        var index = tabs.indexOf(tab);
        tabs.splice(index, 1);
    };
    // tabs
}

oraToolsCtrl.$inject = ['$scope', 'OraToolsService', '$timeout', '$mdUtil', '$log', '$mdEditDialog', '$q', '$mdDialog', '$mdToast', '$filter'];
