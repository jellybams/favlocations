
module.exports.loggedin = function(req, res){
	res.send(req.isAuthenticated() ? req.user : '0');
};

module.exports.login = function(req, res){
	res.send(req.user);
};

module.exports.logout = function(req, res){
	req.logOut();
	res.writeHead(302, {'Location': '/'});
	res.end();
};