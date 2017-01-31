/* eslint-disable */

var configPassport = require('../../config/passport');
var expect = require('chai').expect;
var sinon = require('sinon');
var mongoose = require('mongoose');
var Bluebird = require('bluebird');
require('sinon-as-promised')(Bluebird);
require('sinon-mongoose');
require('../../api/models/db.js');

describe('TDD for config\\passport::', function () {
    var User = mongoose.model('User');
    var loggedUser = null;
    var UserMock = sinon.mock(User);

    beforeEach(function () {
        loggedUser = new User({
            local: {
                email: 'testuser@gmail.com',
                password: 'don\'t_tell_anyone'
            }
        });

        UserMock.restore();
    });

    describe('Need to be able to Login::', function () {
        it('should not return instance of user but should return message saying that user does not exist', sinon.test(function () {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                resolves(null);

            configPassport.loginUser(null, 'testuser@gmail.com', 'don\'t_tell_anyone',
                function (err, user, msg) {
                    expect(user).to.be.null;
                    expect(err).to.be.null;
                    expect(JSON.stringify(msg)).to.contain('Email does not exist');
                });
        }));

        it('should return an error when an error occurs', sinon.test(function () {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                rejects('Error happened');

                configPassport.loginUser(null, 'testuser@gmail.com', 'don\'t_tell_anyone',
                function (err, user, msg) {
                    expect(JSON.stringify(err)).to.contain('Error happened');
                    expect(user).to.be.null;
                    expect(msg).to.be.null;
                });
        }));

        it('should not return instance of user but should return message when password does not match', sinon.test(function () {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                resolves(loggedUser);

            configPassport.loginUser(null, 'testuser@gmail.com', 'wrongPassword',
                function (err, user, msg) {
                    expect(user).to.be.null;
                    expect(err).to.be.null;
                    expect(JSON.stringify(msg)).to.contain('Password do not match');
                });
        }));

        it('should return an instance of user when login is successful', sinon.test(function () {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                resolves(loggedUser);

            configPassport.loginUser(null, 'testuser@gmail.com', 'don\'t_tell_anyone',
                function (err, user, msg) {
                    expect(user).to.not.be(null);
                    expect(msg).to.be.null;
                    expect(err).to.be.null;
                });
        }));
    });
});