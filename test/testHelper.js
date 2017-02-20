var sinon = require('sinon');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = (function () {
    'use strict';

    var userMock = sinon.mock(User);
    var loginData = {
        password: 'don\'t_tell_anyone',
        email: 'email@gmail.com'
    };
    var registerUserData = new User({
        'local.email': 'email@gmail.com',
        'local.password': '$2a$08$LCVeYC1V27HQCPND3u61TOSjeFl3HpWd50Bjk4tBmRji/N/aeRrmu',
        'local.username': 'Mr. J.'
    });
    var registerData = {
        password: 'secretpassword',
        password2: 'secretpassword',
        email: 'email@gmail.com',
        username: 'user name'
    };

    var before = function () {
        userMock = sinon.mock(User);
    }

    var after = function () {
        userMock.restore();
    }

    var makeAgentAuthenticated = function (appAgent, next) {

        // passportConfig.loginUser
        userMock.
            expects('findOne').withArgs(sinon.match.any).
            once().
            chain('exec').
            resolves(registerUserData);

        // passportConfig.deserializeUser
        userMock.
            expects('findById').withArgs(sinon.match.any).
            once().
            chain('exec').
            resolves(registerUserData);

        appAgent.
            post('/account/login').
            send(loginData).
            end(function (err, res) {
                if (err) {
                    throw err;
                }
                next(res);
            });
    };

    return {
        before: before,
        after: after,
        makeAgentAuthenticated: makeAgentAuthenticated,
        registerData: registerData,
        registerUserData: registerUserData,
        loginData: loginData
    }
}());