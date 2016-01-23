'use strict';

Date.prototype.toLocaleFormat = Date.prototype.toLocaleFormat || function (pattern) {
        return pattern.replace(/%Y/g, this.getFullYear()).replace(/%m/g, (this.getMonth() + 1)).replace(/%d/g, this.getDate());
    };

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.events',
    'ui.bootstrap'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/events'});
}]);
