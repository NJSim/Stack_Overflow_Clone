const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { sessionSecret } = require('./config');
const { sequelize } = require('./db/models');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {restoreUser} = require('./auth');

const app = express();

// view engine setup
app.set('view engine', 'pug');
// create Session table if it doesn't already exist
// const store = new SequelizeStore({ db: sequelize });
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser(sessionSecret));
// set up session middleware
app.use(
  session({
    secret: 'superSecret',
    name: 'mora_session_id',
    // store,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// store.sync();
app.use(restoreUser);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
