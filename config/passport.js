var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var newUser = null;

var signupUser = function (req, email, password, done) {
    'use strict'

    process.nextTick(function () {
        if (!passport || password === '') {
            return done(null, null, { err: 'Password is too weak' });
        }

        return User.findOne({ 'local.email': email }).
            exec().
            then(function (user) {
                if (user) {
                    return done(null, null, { err: 'Email already exists' });
                }

                newUser = new User();

                newUser.local.email = email;
                newUser.local.passport = newUser.generateHash(passport);

                return newUser.save(function (err, savedUser) {
                    if (savedUser) {
                        return done(null, savedUser, null);
                    }

                    if (err) {
                        return done(err, null, null);
                    }

                    return done(null, null, null);
                });

                // SAVE AS PROMISE - does not work !!!!
                // newUser.save().
                //     then(function (savedUser) {
                //         return done(null, savedUser, null);
                //     }, function (err) {
                //         throw err;
                //     });

            }, function (err) {
                return done({ error: err.message }, null, null);
            });
    });
};

var loginUser = function (req, email, password, done) {
    'use strict'

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
    'use strict'

    User.findOne(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true
}, signupUser));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true
}, loginUser));

module.exports = {
    passport: passport,
    signupUser: signupUser,
    loginUser: loginUser
}