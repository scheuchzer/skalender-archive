'use strict';
(function () {
    angular.module('myApp.events', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/events', {
                templateUrl: 'events/events.html',
                controller: 'EventsCtrl',
                controllerAs: 'EventsCtrl'

            });
        }])

        .controller('EventsCtrl', ['$scope', '$http', '$log', 'filterFilter', '$uibModal', EventsCtrl]);

    function EventsCtrl($scope, $http, $log, filterFilter, $uibModal) {
        var vm = this;

        vm.filtered = undefined;
        vm.sortType = 'date'; // set the default sort type
        vm.sortReverse = false;  // set the default sort order
        vm.searchFish = '';     // set the default search/filter term
        vm.totalItems = 0;
        vm.bigTotalItems = 0;
        vm.currentPage = 1;
        vm.itemsPerPage = 50;
        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };
        vm.maxSize = 5;

        vm.sort = function (sortType) {
            vm.sortType = sortType;
            vm.sortReverse = !vm.sortReverse;
        };
        $scope.$watch(
            function watchFoo(scope) {
                // Return the "result" of the watch expression.
                return ( vm.searchFish );
            }, filterUpdated
        );

        function filterUpdated(newValue, oldValue) {
            if (angular.isUndefined(newValue) || angular.isUndefined(vm.filtered)) {
                return;
            }
            vm.filtered = filterFilter(vm.events, newValue);
            vm.totalItems = vm.filtered.length; //Math.ceil(vm.filtered.length / vm.itemsPerPage);
            vm.currentPage = 1;
        }

        init();
        function init() {
            $http.get('skalender.json')
                .then(function (res) {
                    vm.events = res.data;
                    vm.bigTotalItems = vm.events.length;
                    vm.events.forEach(function (event) {
                        event.date = new Date(event.date.substring(0, 10));
                        event.dateString = event.date.toLocaleFormat('%d.%m.%Y')
                    });
                    vm.filtered = [];
                    filterUpdated(vm.searchFish);
                });
        }

        vm.open = function (event, size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    event: function () {
                        return event;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }

    angular.module('myApp.events').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, event) {
        $scope.event = event;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();