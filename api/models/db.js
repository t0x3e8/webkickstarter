/* eslint 
    prefer-template: "off",
    no-process-exit: "off" */

var mongoose = require('mongoose');
var debug = require('debug')('mean:db');
var mongoURI = 'mongodb://localhost:27017/blog';
var bluebird = require('bluebird');
var options = { 
    // promiseLibrary: bluebird 
};

mongoose.connect(mongoURI, options, function (err) {
    'use strict';

    if (err) {
        debug('Error while connecting to database: ' + err);
    }
});

mongoose.connection.on('connected', function () {
    'use strict';

    debug('Mongoose connected to database.');
});

mongoose.connection.on('error', function (err) {
    'use strict';

    debug('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    'use strict';

    debug('Mongoose connection closed.');
});

process.on('SIGINT', function () {
    'use strict';

    debug('Mongoose connection closed due to app termination.');
    mongoose.connection.close(function () {
        process.exit(0);
    });
});

process.on('SIGNTERM', function () {
    'use strict';

    debug('Mongoose connection closed due to Heroku service termination.');
    mongoose.connection.close(function () {
        process.exit(0);
    });
});

mongoose.Promise = bluebird;
require('./posts');
require('./users');