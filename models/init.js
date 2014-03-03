var mongoose = require('mongoose'),
	UserSchema = require('./user'),
	LocationSchema = require('./location');

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Location = mongoose.model('Location', LocationSchema);
