/* eslint
    max-statements : ["error",  11]
*/

var LocalStrategy = require('passport-local').Strategy;
var User = require('../api/models/users');
var validator = require('validator');

module.exports = function (passport) {
    'use strict'

    var setMessage = function (req, key, value) {
        if (req.flash) {
            return req.flash(key, value);
        }

        return { key: value }
    }

    var signupUser = function (req, email, password, done) {
        process.nextTick(function () {
            // additional fields,
            var password2 = req.body.password2 || '';
            var userName = req.body.username || '';

            if (!password || validator.isEmpty(password) || !password2 || validator.isEmpty(password2)) {
                return done(null, null, setMessage(req, 'msg', 'Password is too weak'));
            }

            if (password !== password2) {
                return done(null, null, setMessage(req, 'msg', 'Passwords don\'t match'));
            }

            if (!userName || validator.isEmpty(userName)) {
                return done(null, null, setMessage(req, 'msg', 'User name is missing'));
            }

            if (!validator.isEmail(email)) {
                return done(null, null, setMessage(req, 'msg', 'Email is incorrect'));
            }

            return User.findOne({ 'local.email': email }).
                exec().
                then(function (user) {
                    var newUser = new User();

                    if (user) {
                        return done(null, null, setMessage(req, 'msg', 'Email already exists'));
                    }

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.username = userName;

                    return newUser.save(function (err, savedUser) {
                        if (savedUser) {
                            return done(null, savedUser, null);
                        }

                        if (err) {
                            return done(err, null, null);
                        }

                        return done(null, null, null);
                    });
                }, function (err) {
                    return done(setMessage(req, 'err', err.message), null, null);
                });
        });
    };

    var loginUser = function (req, email, password, done) {
        process.nextTick(function () {

            if (!validator.isEmail(email)) {
                return done(null, null, setMessage(req, 'msg', 'Email is incorrect'));
            }

            return User.findOne({ 'local.email': email }).
                exec().
                then(function (user) {
                    if (!user) {
                        return done(null, null, setMessage(req, 'msg', 'Email does not exist'));
                    }

                    if (!user.validPassword(password)) {
                        return done(null, null, setMessage(req, 'msg', 'Password do not match'));
                    }

                    return done(null, user, null);
                }, function (err) {
                    return done(setMessage(req, 'err', err.message), null, null);
                });
        });
    };

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, signupUser));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, loginUser));

    return {
        passport: passport,
        loginUser: loginUser,
        signupUser: signupUser
    };
}