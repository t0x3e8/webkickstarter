/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^next" }] 
vars-on-top : 'off'*/
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('mean:app');
var config = require('config');

require('./api/models/db.js');

debug('Configuration name: ' + config.get('CONFIG_NAME'));
debug('{Process.env: }: ' + config.util.getEnv('NODE_ENV'));

var homeApiRoutes = require('./api/routes/home');
var homeRoutes = require('./server/routes/home');
var backendRoutes = require('./server/routes/backend');

var app = express();

// library which helps prettify Date
app.locals.moment = require('moment');
app.locals.underscore = require('underscore');

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));

app.use('/api', homeApiRoutes);
app.use('/', homeRoutes);
app.use('/admin', backendRoutes);

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