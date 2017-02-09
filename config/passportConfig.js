var LocalStrategy = require('passport-local').Strategy;
var User = require('../api/models/users');

module.exports = function (passport) {
    'use strict'

    var signupUser = function (req, email, password, done) {
        process.nextTick(function () {
            if (!password || password === '') {
                return done(null, null, { err: 'Password is too weak' });
            }

            return User.findOne({ 'local.email': email }).
                exec().
                then(function (user) {
                    var newUser = new User();

                    if (user) {
                        return done(null, null, { err: 'Email already exists' });
                    }

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

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
                    return done({ error: err.message }, null, null);
                });
        });
    };

    var loginUser = function (req, email, password, done) {
        process.nextTick(function () {
            User.findOne({ 'local.email': email }).
                exec().
                then(function (user) {
                    if (!user) {
                        return done(null, null, { error: 'Email does not exist' });
                    }

                    if (!user.validPassword(password)) {
                        return done(null, null, { error: 'Password do not match' });
                    }

                    return done(null, user, null);
                }, function (err) {
                    return done({ error: err.message }, null, null);
                });
        });
    };

    passport.serializeUser(function (user, done) {
        'use strict'

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
        passport : passport,
        loginUser : loginUser,
        signupUser : signupUser
    };
}