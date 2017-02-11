/* eslint 
    no-unused-vars: ["error", { "argsIgnorePattern": "^next" }] 
*/

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('mean:app');
var config = require('config');
var session = require('express-session');
var passport = require('passport');
var app = express();

// CONFIGURATION LOGING
debug('Configuration name: ' + config.get('CONFIG_NAME'));
debug('{Process.env: }: ' + config.util.getEnv('NODE_ENV'));

// DATABASE INITIALIZATION
require('./api/models/db.js');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'thisIsMySecre4',
    resave: true,
    saveUninitialized: true
}));
app.use(logger('dev'));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');
// library which helps prettify Date
app.locals.moment = require('moment');
app.locals.underscore = require('underscore');

// AUTHENTICATION
require('./config/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());

// ROUTING
app.use(function (req, res, next) {
    'use strict'

    res.locals.user = req.user;
    next();
})
app.use('/api', require('./api/routes/home')(express.Router()));
app.use('/', require('./server/routes/home')(express.Router()));
app.use('/account', require('./server/routes/account')(express.Router(), passport));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    'use strict';
    var err = new Error('Not Found');

    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        'use strict';

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    'use strict';

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;