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
  'lat': Number,
  'lng': Number,
  'address': { type: String, validate: [validatePresenceOf, 'The address is required in order to add a new location.'] },
  'name': String
});

LocationSchema.virtual('id')
  .get(function() {
  return this._id.toHexString();
});

//geocode address before saving location
LocationSchema.pre('save', function(next) {
  var location = this;

  geocoder.geocode(this.address, function ( err, data ) {
    if(data && data.status == 'OK'){
      //console.log(util.inspect(data.results[0].geometry.location.lng, false, null));

      //TODO: before saving make sure this location does not already exist by checking lat/lng

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