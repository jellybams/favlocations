var LocationSchema,
    crypto = require('crypto'),
    geocoder = require('geocoder'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('util');

/**
* Model: Location
*/

LocationSchema = new Schema({
  'name': String,
  'address': { type: String, validate: [validatePresenceOf, 'The address is required in order to add a new location.'] },
  'city': {type: String, validate: [validatePresenceOf, 'The city is required in order to add a new location.']},
  'state': {type: String, validate: [validatePresenceOf, 'The state is required in order to add a new location.']},
  'zip': {type: String, validate: [validatePresenceOf, 'The zip code is required in order to add a new location.']},
  'country': {type: String, validate: [validatePresenceOf, 'The country is required in order to add a new location.']},
  'lat': Number,
  'lng': Number
});

LocationSchema.virtual('id')
  .get(function() {
  return this._id.toHexString();
});

LocationSchema.virtual('addressConcat').get(function() {
  var addressConcat = this.address + ', ' + this.city + ', ' + this.state + ', ' + this.zip + ', ' + this.country;

  return addressConcat;
});

//geocode address before saving location
LocationSchema.pre('save', function(next) {
  //geocode address
  var location = this;

  geocoder.geocode(this.addressConcat, function ( err, data ) {
    if(data && data.status == 'OK'){
      //console.log(util.inspect(data.results[0].geometry.location.lng, false, null));

      location.lat = data.results[0].geometry.location.lat;
      location.lng = data.results[0].geometry.location.lng;
    }
    
    //even if geocoding did not succeed, proceed to saving this record
    next();
  });
});

LocationSchema.set('toObject', { virtuals: true })
              .set('toJSON', { virtuals: true });

module.exports = LocationSchema;


/*
* Helper functions
*/
function validatePresenceOf(value) {
  return value && value.length;
}