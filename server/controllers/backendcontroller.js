/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^next" }] */

var request = require('request');
var config = require('config');

var backendcontroller = (function () {
    'use strict';

    var apiAddress = config.get('API.url');

    var addPost = function (req, res, next) {
        res.render('backendNewPost', {
            title: 'New Post',
            status: req.addPostStatus,
            body: req.body
        });
    };

    var doAddPost = function (req, res, next) {
        request.post(apiAddress + '/posts', {
            json: {
                title: req.body.title,
                content: req.body.content,
            }
        }, function (err, response, body) {
            if (!err && response.statusCode === 201) {
                req.addPostStatus = true;
            } else {
                req.addPostStatus = false;
            }

            return next();
        });
    }

    var login = function (req, res, next) {
        res.render('backendlogin', { title: 'Jenny from the blog' });
    };
    
    var register = function (req, res, next) {
        res.render('backendregister', { title: 'Jenny from the blog' });
    };

    return {
        'addPost': addPost,
        'doAddPost': doAddPost,
        'login' : login,
        'register' : register
    };
}());

module.exports = backendcontroller;  