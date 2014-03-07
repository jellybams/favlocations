favlocations.module.controller('LocationListCtrl', 
							['$scope', '$rootScope', '$location', '$timeout', 'User', 'FavLocation',
							function($scope, $rootScope, $location, $timeout, User, FavLocation) {

	$scope.load = function(){
		$rootScope.showLogout = true;
		
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
				var index = favlocations.util.findInList($scope.locations, data.locId, true, '_id');
				$scope.locations.splice(index, 1);
				$rootScope.message = 'Location has been deleted.';
			},
			function(err){
				//error
				//console.log(err);
			});
		}
	};


	$scope.load();
}]);