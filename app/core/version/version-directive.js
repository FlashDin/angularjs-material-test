'use strict';

angular.module('myApp.version.version-directive', [])

.directive('myAppVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);
