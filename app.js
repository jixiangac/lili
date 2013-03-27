
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

//数据库
var MongoStore = require('connect-mongo')(express);
var config = require('./config');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret : config.cookieSecret,
    store : new MongoStore({
      db : config.db
    })
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//生产环境
app.configure('production',function(){
  var maxAge = 3600000 * 24 * 30;
  app.use(express.static(path.join(__dirname,'public'),{maxAge:maxAge}));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
