var express = require('express'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  UserSchema = require('./models/user'),
  LocationSchema = require('./models/location'),
  util = require('util'),
  ObjectId = require('mongoose').Types.ObjectId;


// Load configurations
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

// Connect to db
mongoose.connect(config.db, { server: { socketOptions: {keepAlive:1} } });

// define models
User = mongoose.model('User', UserSchema);
Location = mongoose.model('Location', LocationSchema);


// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    //User.find()

    User.findOne({'username': username}, { 'locations': 0 }, function(err, user){
      if(err){
        return done(null, false, { message: 'Incorrect credentials.' });
      }

      if( !user.authenticate(password) ){
        return done(null, false, { message: 'Incorrect credentials.' });
      }

      return done(null, user);
    });
    
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    //done(null, user.id);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    /*
    User.findById(id, function(err, user) {
        done(err, user);
      });
    */
    done(null, user);
});

// Define a middleware function to be used for every secured route
var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};



// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  //send all api responses as json
  regex = new RegExp('/^/api\//i');
  if( regex.test(req.url) ){
    res.contentType('application/json'); 
  }
  console.log(regex.test(req.url));
  
  next();
});
app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.methodOverride());
app.use(express.session({ secret: 'securedsession' }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// routes
app.get('/', function(req, res){
  res.render('index', { title: 'Favorite Locations' });
});




app.post('/api/v1/locations', function(req, res){
  var newLocation = req.body;

  User.findById(req.user._id, function(err, user){
    user.locations.push(newLocation);

    console.log(user);

    user.save(function(err, user){
      if(err){
        res.send({message: 'Unable to save new location.'}, 500);
      }
      else{
      	res.send(200);
      }

      
    });
  });
});


app.delete('/api/v1/locations/:locId', auth, function(req, res){

	var self = this;
	User.findOneAndUpdate(
    	{_id: req.user._id}, 
    	{$pull: {locations: {_id: req.params.locId}}},
    	function(err, user) {
    		if(err){
    			res.send({message: err.message}, 400);
    		}
    		else{
    			res.send({locId: self.req.params.locId}, 200);
    		}
    	});
});



app.get('/api/v1/locations/:locId', auth, function(req, res){

    User.find()
    .where('locations._id', req.params.locId)
    .select({'locations.$': 1})
    .exec(function(err, data){
        if(err){ 
          res.send(err, 400); 
        }
        else{
          if( data[0].locations[0] ) {
           res.send(data[0].locations[0]);  
          }
          else{
            res.send({});
          }
        }
    });
});



app.get('/api/v1/users/:userId', function(req, res){
  User.findOne({'_id': req.params.userId}, function(err, user){
    if(err){
      res.send(err, 400);
    }
    else{
      res.send(user);
    }
  });
});


// routes to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.get('/logout', function(req, res){
  req.logOut();
  //res.send(200);

  res.writeHead(302, {
  'Location': '/'
  });
  res.end();
});


app.get('/users', function(req, res){
	User.find(function(err, users){
		res.send(users);
	});
});




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


