var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var passport_ = require('./project_modules/authentication');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// changed from 'dev' to 'common'
app.use(logger('common'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'caboverde-14.05.2024',
  resave: false,
  saveUninitialized: false
}));
app.use(passport_.initialize());
app.use(passport_.session());

app.use('/', indexRouter);

//////////////////////////////////////////////////
// custom routes

var routesRootDirPath = './routes/'
var routesName = [
  'users',
  'login'
]

let routesImported = []
for (const routeName of routesName) {
  routesImported.push(require(routesRootDirPath + routeName))
}

for (let i = 0; i < routesImported.length; i++) {
  app.use('/' + routesName[i], routesImported[i]);
}
//////////////////////////////////////////////////

const swaggerUI = require('swagger-ui-express');
var fs = require('fs');
var jsyaml = require('js-yaml');
var spec = fs.readFileSync('./swagger.yaml', 'utf8');
swaggerDocument = jsyaml.load(spec);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;