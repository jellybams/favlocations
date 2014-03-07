
favlocations.module.controller('LocationCtrl', ['$scope', '$rootScope', '$routeParams', 'FavLocation', '$location', 'Validator', 
												function($scope, $rootScope, $routeParams, FavLocation, $location, Validator){

	$scope.load = function(){

		$scope.locationId = $routeParams.locationId;
		$rootScope.showLogout = true;
		$scope.favlocation = {};

		if( $routeParams.locationId != 0 ){
			//get the current location record
			FavLocation.get($routeParams.locationId, function(data){
				//success
				$scope.favlocation = data;

				var mapOptions = {
					zoom: 11,
					center: new google.maps.LatLng(data.lat, data.lng)
				};

				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				var myLatlng = new google.maps.LatLng(data.lat, data.lng);
				var marker = new google.maps.Marker({
				    position: myLatlng,
				    map: map,
				    title: data.name || 'Your Location'
				});
    		},

			function(err){
				$rootScope.message = 'There was a problem loading that location.';
				$location.path('locations');
			});
		}
		
	};

	$scope.save = function(){

		if (!$scope.validate()) {
			return;
		}

		FavLocation.save($scope.favlocation, function(data){
			$rootScope.message = 'Location saved.'
			$location.path('locations');
		},
		function(err){
			//error
			$rootScope.message = 'There was an error saving this location. Check your field values.';
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


	$scope.cancel = function(){
		$rootScope.message = null;
		$location.path('/locations');
	}


	$scope.validate = function() {

		$scope.invalid = [];
		$scope.errors = $scope.validator.test($scope.favlocation);

		console.log($scope.errors);

		if ($scope.errors !== true) {
			$scope.errors.forEach(function(err) {
				$scope.invalid[err.field] = true;
			});
			$rootScope.message = 'Looks like something is wrong... the fields outlined in red are required.';

			console.log($scope.invalid);

			return false;
		}

		return true;
	};


	$scope.validator = Validator.create({
		reqd : ['name', 'address', 'city', 'state', 'country']
	});


	$scope.load();
}]);