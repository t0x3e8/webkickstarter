/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^next|^body|^res" }] */

var request = require('request');
var config = require('config');

var backendcontroller = function () {
    'use strict';

    var apiAddress = config.get('API.url');

    var addPost = function (req, res, next) {
        res.render('backendnewpost', {
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
        res.render('backendlogin', {
            title: 'Jenny from the blog',
            message: req.flash('msg'),
            error: req.flash('err')
        });
    };

    var logout = function (req, res) {
        req.logout();
        res.redirect('/');
    }

    var register = function (req, res, next) {
        res.render('backendregister', {
            title: 'Jenny from the blog',
            message: req.flash('msg'),
            error: req.flash('err')
        });
    };

    var ensureAuthentication = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        return res.redirect(302, '/account/login');
    }

    // passport.authenticate('local-signup', {}, function (err, user, msg) {
    //     if (err) {
    //         return next(err);
    //     }

    //     if (user) {
    //         req.login(user, function (loginError) {
    //             return next(loginError);
    //         });
    //     }

    //     return res.status(404).send(msg);
    // });

    return {
        'addPost': addPost,
        'doAddPost': doAddPost,
        'login': login,
        'register': register,
        'logout': logout,
        'ensureAuthentication' : ensureAuthentication
    };
};

module.exports = backendcontroller;  