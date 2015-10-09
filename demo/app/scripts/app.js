'use strict';

/**
 * @ngdoc overview
 * @name Demo
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('Demo', ['ionic', 'jett.ionic.filter.bar'])

  .config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController'
      });
    $urlRouterProvider.otherwise('/app');

    //You can override the config such as the following

    /*
    $ionicFilterBarConfigProvider.theme('calm');
    $ionicFilterBarConfigProvider.clear('ion-close');
    $ionicFilterBarConfigProvider.search('ion-search');
    $ionicFilterBarConfigProvider.backdrop(false);
    $ionicFilterBarConfigProvider.transition('vertical');
    $ionicFilterBarConfigProvider.placeholder('Filter');
    */
  })

  .run(function ($window, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      if ($window.cordova && $window.cordova.plugins.Keyboard) {
        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        $window.cordova.plugins.Keyboard.disableScroll(true);
      }
    });
  })

  .factory('geoData', ['$http', '$q', 'limitToFilter', function ($http, $q, limitToFilter) {
  	return {
  		getCities: function(query, options) {
        var deferred = $q.defer();
  			var url = "http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK&q=";

  			$http.jsonp(url + encodeURIComponent(query))
  					.success(function (result) {
  						deferred.resolve(result);
  					})
            .error(function(err){
              deferred.reject(err);
            });

        return deferred.promise;
  		}
  	}
  }])

  .controller('MainController', function($scope, $timeout, $ionicFilterBar, geoData) {

    var filterBarInstance;

    function getItems () {
      var items = [];
      // for (var x = 1; x < 2000; x++) {
      //   items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
      // }
      $scope.items = items;
    }

    getItems();

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: [],
        update: function (filteredItems, filterText) {
          if(filterText.length >= 3) {
            $scope.cities = geoData.getCities(filterText);
            $scope.cities.then(function(data){
              $scope.items = data;
            });  
          }
        }
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
  });
