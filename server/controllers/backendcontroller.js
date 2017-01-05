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
        var reqOptions = {
            url: apiAddress + '/posts',
            method: 'POST',
            json: {
                title: req.body.title,
                content: req.body.content
            }
        };

        request(reqOptions, function (err, response) {
            if (!err && response.statusCode === 201) {
                req.addPostStatus = true;
            } else {
                req.addPostStatus = false;
            }

            return next();
        });
    }

    return {
        'addPost': addPost,
        'doAddPost': doAddPost
    };
}());

module.exports = backendcontroller;  