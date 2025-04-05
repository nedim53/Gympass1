var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var kupovinaRouter = require('./routes/kupovina');
var registracijaRouter = require('./routes/registracija');
var kontaktRouter = require('./routes/kontakt');
var profilRouter = require('./routes/profil');

/* -------------------- ADMIN JE ISPOD-----------*/
var homeAdminRouter = require('./routes/homeAdmin');
var kupovinaAdminRouter = require('./routes/kupovinaAdmin');
var profilAdminRouter = require('./routes/profilAdmin');
var kontaktAdminRouter = require('./routes/kontaktAdmin');
var teretaneAdminRouter = require('./routes/teretaneAdmin');
var teretaneAdminDetalji = require('./routes/teretanaAdminDetalji');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home',homeRouter);
app.use('/kupovina',kupovinaRouter);
app.use('/registracija',registracijaRouter);
app.use('/kontakt',kontaktRouter);
app.use('/profil',profilRouter);


app.use('/homeAdmin',homeAdminRouter);
app.use('/kupovinaAdmin',kupovinaAdminRouter);
app.use('/kontaktAdmin',kontaktAdminRouter);
app.use('/profilAdmin',profilAdminRouter);
app.use('/teretaneAdmin', teretaneAdminRouter);
app.use('/teretanaAdminDetalji',teretaneAdminDetalji);


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
