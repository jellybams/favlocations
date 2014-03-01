var favlocations = favlocations || { 
									'baseUrl': 'http://localhost:3000/', 
									'apiUrl': 'http://localhost:3000/api/v1/' 
								};

favlocations.module = angular.module('favlocations', ['ngRoute', 'ngResource', 'google-maps'])
	.config(function($routeProvider, $locationProvider, $httpProvider){

		//function to check if the user is logged in before loading route
		var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
			var deferred = $q.defer();

			$http.get('/loggedin').success(function(user){
				if( user != 0 ) {
					//save user object for later use
					$rootScope.user = user;
					$timeout(deferred.resolve, 0);
				}
				else {
					$rootScope.message = 'Please login.';
					//$timeout(function(){ deferred.reject(); }, 0);
					deferred.reject();
					$location.url('/login');
				}
			});

			return deferred.promise;
		};
		
		//check for 401 response on all http requests
		$httpProvider.responseInterceptors.push(function($q, $location){
			return function(promise){
				return promise.then(
					//success, return the response
					function(response){
						return response;
					},

					function(response){
						if( response.status == 401 ){
							$location.url('/login');
						}
						return $q.reject(response);
					}
				);
			};
		});
		

		$routeProvider
			.when('/login', {controller: 'LoginCtrl', templateUrl: 'ng/views/login.html'})
			.when('/locations', {controller: 'LocationListCtrl', templateUrl: 'ng/views/locations.html', resolve: {loggedin: checkLoggedin}})
			.when('/locations/:locationId', {controller: 'LocationCtrl', templateUrl: 'ng/views/editlocation.html'})
			.otherwise({redirectTo: '/locations'});
	});

favlocations.module.controller('LoginCtrl', function($scope, $rootScope, $http, $location){
	$scope.user = {};

	$scope.login = function(){
		//do login
		$http.post('/login', {
			username: $scope.user.username,
			password: $scope.user.password
		})
		.success(function(user){
			$rootScope.message = 'You logged in!';
			$location.url('/locations');
		})
		.error(function(){
			$rootScope.message = 'Wrong credentials, try alex / alex';
			$location.url('/login');
		});
	};
});


favlocations.module.controller('LocationListCtrl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {
	$scope.load = function(){
		$scope.locations = {};
		$scope.locations = $rootScope.user.locations;
	};

	$scope.editLocation = function(locId){
		$location.path('locations/' + locId);
	};

	$scope.load();
}]);


favlocations.module.controller('LocationCtrl', ['$scope', '$routeParams', 'FavLocation', function($scope, $routeParams, FavLocation){
	$scope.load = function(){
		//get the current location record
		FavLocation.get($routeParams.locationId, function(data){
			//success
			console.log(data);
		},
		function(err){
			//error
			console.log(err);
		});

		//google map params
		$scope.map = {
				    center: {
				        latitude: 45,
				        longitude: -73
				    },
				    zoom: 8,
				    draggable: 'false',
				    marker: {
				    	coords: {latitude: 45, longitude: -73},
				    	iconuri: 'http://localhost:3000/img/redpin-sm.png'
				    }
				};
	}

	$scope.load();
}]);



favlocations.module.factory('FavLocation', function($http){
	var FavLocation = {};

	FavLocation.baseUrl = favlocations.apiUrl + 'locations/';

	FavLocation.get = function(id, success, error){
		var url = this.baseUrl + id;
		$http.get(url).success(success).error(error);
	};

	return FavLocation;
});


favlocations.module.factory('User', function($http){
	var User = {};

	User.baseUrl = favlocations.apiUrl + 'users'; 

	User.get = function(id, success, error){
		var url = this.baseUrl + '/' + id;

		$http.get(url).success(success).error(error);
	};

	User.loggedIn = function(success, error){
		var url = favlocations.baseUrl + 'loggedin';

		$http.get(url).success(success).error(error);
	};

	return User;
});