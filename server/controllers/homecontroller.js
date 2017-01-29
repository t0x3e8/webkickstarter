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
        request.get(apiAddress + '/posts', { json: {} }, function (err, response, body) {
            if (err) {
                res.status(404).json(err);
            } else if (response.statusCode === 200) {
                renderIndex(res, body);                
            } else if (response.statusCode === 404) {
                renderIndex(res, []);
            } else {
                res.status(response.statusCode).json(body);
            }
        });
    };

    var postDetails = function (req, res, next) {
        request.get(apiAddress + '/posts/' + req.params.postId, { json: {} },
            function (err, response, body) {
                if (err) {
                    res.status(404).json(err);
                } else if (response.statusCode === 200) {
                    renderPostDetails(res, body);
                } else {
                    res.status(response.statusCode).json(body);
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
            function (err, response, body) {
                if (err) {
                    res.status(404).json(err);
                } else if (response.statusCode === 201) {
                    res.redirect('/post/' + req.params.postId);
                } else {
                    res.status(response.statusCode).json(body);
                }
            }
        );
    };

    var about = function (req, res, next) {
        res.render('homeabout', { title: 'Jenny from the blog' });
    };
    
    var login = function (req, res, next) {
        res.render('homelogin', { title: 'Jenny from the blog' });
    };

    return {
        'index': index,
        'about': about,
        'login' : login,
        'postDetails': postDetails,
        'addComment': addComment
    };
}());

module.exports = homecontroller;  