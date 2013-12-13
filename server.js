root.settings =       	require('./server/config').settings;

var express =       require('express')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , User =        require('./server/models/User.js');

var app = module.exports = express();

app.configure(function() {
	app.set('port', process.env.PORT || 8000);
	app.use(express.favicon());
});

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));
	
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);
var server = http.createServer(app);
require('./server/models/socket')(server);
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

/*app.start = app.listen = function(){
	  return server.listen.apply(server, arguments);
}
app.start(8000);*/
	
	
