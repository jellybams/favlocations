var UserSchema,
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema
    LocationSchema = require('./location');

/**
* Model: User
*/

UserSchema = new Schema({
  'username': { type: String, validate: [validatePresenceOf, 'a username is required'], index: { unique: true } },
  'hashed_password': String,
  'salt': String,
  'locations': [LocationSchema]
});

UserSchema.virtual('id')
  .get(function() {
  return this._id.toHexString();
});

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

UserSchema.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
});

UserSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

UserSchema.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

UserSchema.pre('save', function(next) {
  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

module.exports = UserSchema;


/*
* Helper functions
*/
function validatePresenceOf(value) {
  return value && value.length;
}