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
			.when('/locations/:locationId', {controller: 'LocationCtrl', templateUrl: 'ng/views/editlocation.html', resolve: {loggedin: checkLoggedin}})
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







favlocations.module.controller('LocationListCtrl', 
							['$scope', '$rootScope', '$location', '$timeout', 'User', 'FavLocation',
							function($scope, $rootScope, $location, $timeout, User, FavLocation) {

	$scope.load = function(){
		if( $rootScope.message ){
			$timeout(function(){
				$rootScope.message = null;
			}, 4000)
		}

		$scope.locations = {};
		User.get($rootScope.user._id, function(data){
			$scope.locations = data.locations;
		});
		
	};

	$scope.edit = function(locId){
		$location.path('locations/' + locId);
	};

	$scope.new = function(){
		$location.path('locations/0');
	}

	$scope.remove = function(locId){

		if( window.confirm('Are you sure you want to delete this location?') ){
			FavLocation.remove(locId, function(data){
				

				console.log(data);
				console.log($scope.locations);


				var index = favlocations.util.findInList($scope.locations, data.locId, true, '_id');
				$scope.locations.splice(index, 1);
				$rootScope.message = 'Location has been deleted.';
			},
			function(err){
				//error
				console.log(err);
			});
		}
	};


	$scope.load();
}]);








favlocations.module.controller('LocationCtrl', ['$scope', '$rootScope', '$routeParams', 'FavLocation', '$location',
												function($scope, $rootScope, $routeParams, FavLocation, $location){
	$scope.load = function(){

		$scope.locationId = $routeParams.locationId;
		$scope.favlocation = {};
		$scope.map = {};

		if( $routeParams.locationId != 0 ){
			//get the current location record
			FavLocation.get($routeParams.locationId, function(data){
				//success
				$scope.favlocation = data;

				//google map params
				$scope.map = {
						    center: {
						        latitude: data.lat,
						        longitude: data.lng
						    },
						    zoom: 8,
						    draggable: 'false',
						    marker: {
						    	coords: {latitude: data.lat, longitude: data.lng},
						    	iconuri: 'http://localhost:3000/img/redpin-sm.png'
						    }
						};
			},
			function(err){
				//error - redirect back to location list and show error message
				//console.log(err);
			});
		}
		
	};

	$scope.save = function(){
		//if (!$scope.validate()) {
		//	return;
		//}

		console.log('original: ');
		console.log($scope.favlocation);


		var locationTransformed = FavLocation.prepareParams($scope.favlocation);
		
		console.log('transformed: ');
		console.log(locationTransformed);
		

		FavLocation.save(locationTransformed, function(data){
			$rootScope.message = 'Location saved.'
			$location.path('locations');
		},
		function(err){
			//error
			$rootScope.message = 'There was an error saving this location.';
		});
		
	};

	$scope.remove = function(){
		if( window.confirm('Are you sure you want to delete this location?') ){
			FavLocation.remove($scope.favlocation._id, function(data){
				$rootScope.message = 'Location deleted.';
				$location.path('locations');
			},
			function(err){
				$rootScope.message = 'Oops: '+err.message;
			});
		}
	}

	$scope.load();
}]);













favlocations.module.factory('FavLocation', function($http){
	var FavLocation = {};

	FavLocation.url = favlocations.apiUrl + 'locations/';

	FavLocation.get = function(id, success, error){
		var url = this.url + id;
		console.log(url);
		$http.get(url).success(success).error(error);
	};

	FavLocation.save = function(location, success, error){

		//var filtered = favlocations.util.mergeInto(FavLocation.create(), location);

		if( location._id ){
			$http.put( this.url + id, location ).sucess(success).error(error);
		}
		else{
			$http.post( this.url, location ).success(success).error(error);
		}
	};

	FavLocation.remove = function(id, success, error){
		$http.delete(FavLocation.url + id).success(success).error(error);
	};

	FavLocation.prepareParams = function(locationFields){
		var transformed = {};
		transformed.address = locationFields.address + ', ' + locationFields.city + ', ' + locationFields.state + ', ' + locationFields.zip + ' ' + locationFields.country;
		transformed.name = locationFields.name;

		return transformed;
	}

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














favlocations.util = {};

/**
 * Overwrite dest object with values from src object
 *
 * @param   object   dest   Destination object. Only keys that exist will be updated (i.e. no new keys will be merged)
 * @param   object   src    Source object
 *
 * @return  object
 */
favlocations.util.mergeInto = function(dest, src){
	for (var i in dest) {
		if (dest.hasOwnProperty(i) && typeof src[i] != 'undefined') {
			dest[i] = src[i];
		}
	}

	return dest;
}


/**
 * Find item by key in a list
 *
 * @param   array    list   List of items
 * @param   mixed    id     Value to find
 * @param   bool     idx    True to return index in list, else return object
 * @param   string   key    Key name (defaults to 'id')
 *
 * @return  mixed
 */
favlocations.util.findInList = function(list, val, idx, key) {

	key = key ? key : 'id';
	for (var i = 0; i < list.length; i++) {
		console.log(list[i][key]);
		if (list[i][key] == val) {
			return idx ? i : list[i];	
		}
	}

	return idx ? false : null;
};

