var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var logger = require('./routes/component/register/logger');
var sessionFilter = require('./routes/component/register/sessionFilter');

var routes = require('./routes/index');
//var users = require('./routes/users');
var bmaps = require('./routes/bmap');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(session({
	secret: '79198',
	name: 'myses.sid',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
	cookie: {maxAge: 3600000 },  //设置maxAge单位ms，即30min后session和相应的cookie失效过期
	resave: false,
	saveUninitialized: true
}));
logger.use(app);  //日志打印
app.use(sessionFilter());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);
app.use('/bmap', bmaps);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境，客户端获得status和err的全部信息
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}*/

// 生产环境，打印错误信息到日志中，客户端获得status和err.message
app.use(function(err, req, res, next) {
  logger.logger.error('[logger] %s %s throw error %d times, %s', req.method, req.url, err.length||1, err.toString());
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
