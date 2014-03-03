
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