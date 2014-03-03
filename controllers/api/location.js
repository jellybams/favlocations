var models = require('../../models/init');

//get a single location document
module.exports.single = function(req, res){
	models.User.find()
    .where('locations._id', req.params.locId)
    .select({'locations.$': 1})
    .exec(function(err, data){
        if(err){ 
          res.send(err, 400); 
        }
        else{
          if( data[0] && data[0].locations[0] ) {
           res.send(data[0].locations[0]);  
          }
          else{
            res.send({});
          }
        }
	});
};

//create a new location document, will be inserted as a subdocument in the parent user doc
module.exports.create = function(req, res){
	var newLocation = req.body;

	models.User.findById(req.user._id, function(err, user){

		//console.log('req.body:');
		//console.log(newLocation);
		//console.log();

		user.locations.push(newLocation);

		//console.log(user);

		user.save(function(err, user){
			if(err){
				res.send({message: 'Unable to save new location.'}, 500);
			}
			else{
				res.send(200);
			}
		});
	});
};

module.exports.remove = function(req, res){
	var locId = req.params.locId;
	models.User.findOneAndUpdate(
    	{_id: req.user._id}, 
    	{$pull: {locations: {_id: locId}}},
    	function(err, user) {
    		if(err){
    			res.send({message: err.message}, 400);
    		}
    		else{
    			res.send({locId: locId}, 200);
    		}
    	});
};



