var express = require('express'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  UserSchema = require('./models/user');
  LocationSchema = require('./models/location')
  var util = require('util');


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
    User.findOne({'username': username}, function(err, user){
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
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'securedsession' }));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// routes
app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});

app.get('/api/v1/locations', auth, function(req, res){
  User.find({'locations.name': '*'}, function(err, data){
    if( err ){ console.log(util.inspect(err, false, null));}

    console.log(util.inspect(data, false, null)); 

    res.send(data);
  }); 
});

app.get('/api/v1/locations/:locId', auth, function(req, res){
  User.find({'locations.name': '*'}, function(err, data){
    if( err ){ console.log(util.inspect(err, false, null));}

    console.log(util.inspect(data, false, null)); 

    res.send(data);
  }); 
});


app.get('/users', function(req, res){
  res.send([{name: "user1"}, {name: "user2"}]);
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




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


