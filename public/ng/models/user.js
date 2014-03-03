
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