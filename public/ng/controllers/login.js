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