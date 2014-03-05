
favlocations.module.controller('LocationCtrl', ['$scope', '$rootScope', '$routeParams', 'FavLocation', '$location',
												function($scope, $rootScope, $routeParams, FavLocation, $location){

	$scope.load = function(){

		$scope.locationId = $routeParams.locationId;
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
				    title:"Hello World!"
				});

				//google map params
				/*
				$scope.map = {
				    center: {
				        latitude: data.lat,
				        longitude: data.lng
				    },
				    zoom: 10,
				    draggable: 'false',
				    marker: {
				    	coords: {latitude: data.lat, longitude: data.lng},
				    	iconuri: 'http://localhost:3000/img/redpin-sm.png'
				    }
				    
				};
				*/
    		},

			function(err){
				//error - redirect back to location list and show error message
				//console.log(err);
			});

			/*
			$scope.map = {
				center: {
					latitude: 40.82628,
					longitude: -100.722656
				},
				zoom: 10,
			    events: {
			    	tilesloaded: function(map){
			    		console.log(map);
				    	$scope.$apply(function () {
				    		
        					//var myLatlng = new google.maps.LatLng(data.lat, data.lng);
							//var marker = new google.maps.Marker({ map: map, position: myLatlng });
    					});
			    		}
			    	}
			};
			*/
		}
		
	};

	$scope.save = function(){
		//if (!$scope.validate()) {
		//	return;
		//}

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