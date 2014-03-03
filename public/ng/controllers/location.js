
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
		/*
		console.log('original: ');
		console.log($scope.favlocation);


		var locationTransformed = FavLocation.prepareParams($scope.favlocation);
		
		console.log('transformed: ');
		console.log(locationTransformed);
		*/

		FavLocation.save($scope.favlocation, function(data){
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