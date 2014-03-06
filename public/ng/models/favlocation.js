
favlocations.module.factory('FavLocation', ['$http', function($http){
	var FavLocation = {};

	FavLocation.url = favlocations.apiUrl + 'locations/';

	FavLocation.create = function(){
		var data = {
			name: '',
			address: '',
			city: '',
			state: '',
			zip: '',
			country: ''
		};

		return data;
	};

	FavLocation.get = function(id, success, error){
		var url = this.url + id;
		console.log(url);
		$http.get(url).success(success).error(error);
	};

	FavLocation.save = function(location, success, error){

		var filtered = favlocations.util.mergeInto(this.create(), location);

		if( location._id ){
			$http.put( this.url + location._id, filtered ).success(success).error(error);
		}
		else{
			$http.post( this.url, filtered ).success(success).error(error);
		}
	};

	FavLocation.remove = function(id, success, error){
		$http.delete(FavLocation.url + id).success(success).error(error);
	};

	FavLocation.prepareParams = function(locationFields){
		var transformed = {};
		transformed.address = locationFields.address + ', ' + locationFields.city + ', ' + locationFields.state + ', ' + locationFields.zip + ',' + locationFields.country;
		transformed.name = locationFields.name;

		return transformed;
	}

	return FavLocation;
}]);