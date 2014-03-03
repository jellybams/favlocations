var models = require('../../models/init');

exports.single = function(req, res){
	models.User.findOne({'_id': req.params.userId}, function(err, user){
		if(err){
			res.send(err, 400);
		}
		else{
			res.send(user);
		}
	});
};