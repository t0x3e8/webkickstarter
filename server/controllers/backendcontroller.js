/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^next" }] */

var debug = require('debug')('mean:app');

var backendcontroller = (function () {
    'use strict';

    var newPost = function (req, res, next) {
        var status = 0;

        if (req.method === 'POST') {
            debug('this is POST');
            debug(req.body);

            if (req.body.title && req.body.content && req.body.date) {
                status = 1;
            } else { 
                status = -1;
            } 
        }

        res.render('backendNewPost', {
            title: 'New Post',
            status : status,
            body: req.body
        });

    };

    return {
        'newPost' : newPost,
    };
}());

module.exports = backendcontroller;  