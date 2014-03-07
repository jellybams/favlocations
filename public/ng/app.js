var favlocations = favlocations || { 
									'baseUrl': 'http://localhost:3000/', 
									'apiUrl': 'http://localhost:3000/api/v1/' 
								};

favlocations.module = angular.module('favlocations', ['ngRoute', 'ngResource'])
	.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
		

		function checkLoggedin($q, $timeout, $http, $location, $rootScope){
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
		$httpProvider.responseInterceptors.push(['$q', '$location', function($q, $location){
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
		}]);
		
		

		$routeProvider
			.when('/login', {controller: 'LoginCtrl', templateUrl: 'ng/views/login.html'})
			.when('/locations', {controller: 'LocationListCtrl', 
				templateUrl: 'ng/views/locations.html', 
				resolve: {loggedin: checkLoggedin}
			})
			.when('/locations/:locationId', {controller: 'LocationCtrl', 
				templateUrl: 'ng/views/editlocation.html', 
				resolve: {loggedin: checkLoggedin}})
			.otherwise({redirectTo: '/locations'});

	}]);



favlocations.module.run(['$q', '$timeout', '$http', '$location', '$rootScope', 
	function($q, $timeout, $http, $location, $rootScope) {

	

}]);



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
		if (list[i][key] == val) {
			return idx ? i : list[i];	
		}
	}

	return idx ? false : null;
};

