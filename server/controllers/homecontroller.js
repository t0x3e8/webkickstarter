/* eslint 
    no-unused-vars: ["error", { "argsIgnorePattern": "^next" }] 
    max-len: ["error", {"code" : 256}]    
*/
var request = require('request');
var config = require('config');

var homecontroller = (function () {
    'use strict';

    var apiAddress = config.get('API.url');

    var renderPostDetails = function (res, post) {
        res.render('homepostdetails', {
            title: 'Jenny from the blog',
            post: post
        });
    }

    var renderIndex = function (res, posts) {
        res.render('homeindex', {
            title: 'Jenny from the blog',
            posts: posts
        });
    }

    var index = function (req, res, next) {
        request.get(apiAddress + '/posts', { json: {} }, function (err, response, posts) {
            if (!err && response.statusCode === 200) {
                renderIndex(res, posts);
            } else if (err) {
                res.json(err);
                res.status(404);
            }
        });
    };

    var postDetails = function (req, res, next) {
        request.get(apiAddress + '/posts/' + req.params.postId, { json: {} }, function (err, response, post) {
            if (!err && response.statusCode === 200) {
                renderPostDetails(res, post);
            } else if (err) {
                res.json(err);
                res.status(404);
            }
        });
    }

    var addComment = function (req, res, next) {
        request.post(apiAddress + '/posts/' + req.params.postId + '/comments',
            {
                json: {
                    author: req.body.author,
                    content: req.body.content
                }
            },
            function (err, response) {
                if (!err && response.statusCode === 201) {
                    res.redirect('/post/' + req.params.postId);
                } else if (err) {
                    res.json(err);
                    res.status(404);
                }
            }
        );
    };

    var about = function (req, res, next) {
        res.render('homeabout', { title: 'Jenny from the blog' });
    };

    return {
        'index': index,
        'about': about,
        'postDetails': postDetails,
        'addComment': addComment
    };
}());

module.exports = homecontroller;  