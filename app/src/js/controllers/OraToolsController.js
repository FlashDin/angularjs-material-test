'use strict';

var mod = angular.module('oratools.controller', [
    'oratools.service'
]);

mod.controller('OraToolsCtrl', oraToolsCtrl);

function oraToolsCtrl($scope, OraToolsService, $timeout, $mdUtil, $log, $mdEditDialog, $q) {
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
    $scope.loadData = function (params) {
        $scope.params = {query: params};
        OraToolsService.findAll($scope.params)
            .then(function (response) {
                // $scope.data = response.data;
                // $scope.keyes = (Object.keys($scope.data[0]));
                console.log($scope.data);
            })
            .catch(function (response) {
                console.error('Error findAll:', response.status, response.data);
            })
            .finally(function () {
                console.log("Task Finished.");
            });
    };
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
    }
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

    // tabs
    var tabs = [
            {
                title: 'Zero (AKA 0, Cero, One - One, -Nineteen + 19, and so forth and so on and continuing into what seems like infinity.)',
                content: 'Woah...that is a really long title!'
            },
            {title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
            {title: 'Two', content: "You can swipe left and right on a mobile device to change tabs."},
            {title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
            {title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
            {title: 'Five', content: "If you remove a tab, it will try to select a new one."},
            {title: 'Six', content: "There's an ink bar that follows the selected tab, you can turn it off if you want."},
            {
                title: 'Seven',
                content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."
            },
            {
                title: 'Eight',
                content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"
            },
            {title: 'Nine', content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs."},
            {title: 'Ten', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
            {title: 'Eleven', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
            {title: 'Twelve', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
            {
                title: 'Thirteen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {
                title: 'Fourteen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {
                title: 'Fifteen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {
                title: 'Sixteen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {
                title: 'Seventeen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {
                title: 'Eighteen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {
                title: 'Nineteen',
                content: "If you're still reading this, you should just go check out the API docs for tabs!"
            },
            {title: 'Twenty', content: "If you're still reading this, you should just go check out the API docs for tabs!"}
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

oraToolsCtrl.$inject = ['$scope', 'OraToolsService', '$timeout', '$mdUtil', '$log', '$mdEditDialog', '$q'];
