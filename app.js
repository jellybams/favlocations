var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	util = require('util'),
	userRoutes = require('./controllers/user'),
	userApiRoutes = require('./controllers/api/user'),
	locationApiRoutes = require('./controllers/api/location'),
	models = require('./models/init');
	

//load config
env = process.env.NODE_ENV || 'development';
config = require('./config/config')[env];

// Connect to db
mongoose.connect(config.db, { server: { socketOptions: {keepAlive:1} } });

// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    //User.find()

    models.User.findOne({'username': username}, { 'locations': 0 }, function(err, user){
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
	{
		res.send(401);
	}
	else{
		next();
	}
};

// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//send all api responses as json
app.use(function(req, res, next) {
	regex = new RegExp('/^/api\//i');
	if( regex.test(req.url) ){
		res.contentType('application/json'); 
	}

	next();
});

app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.methodOverride());
app.use(express.session({ secret: 'Xmem23lvlsdfu4D' }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}


// API routes
app.post('/api/v1/locations', auth, locationApiRoutes.create);
app.delete('/api/v1/locations/:locId', auth, locationApiRoutes.remove);
app.get('/api/v1/locations/:locId', auth, locationApiRoutes.single);
app.get('/api/v1/users/:userId', auth, userApiRoutes.single);

//auth routes
app.get('/loggedin', userRoutes.loggedin);
app.post('/login', passport.authenticate('local'), userRoutes.login);
app.get('/logout', userRoutes.logout);



//run server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


