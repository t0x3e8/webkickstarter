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
    var UserMock = null;

    beforeEach(function () {
        loggedUser = new User({
            local: {
                email: 'testuser@gmail.com',
                password: "$2a$08$LCVeYC1V27HQCPND3u61TOSjeFl3HpWd50Bjk4tBmRji/N/aeRrmu"
            }
        });

        UserMock = sinon.mock(User);
    });

    afterEach(function () {
        UserMock.restore();
    })

    describe('Need to be able to Login::', function () {
        it('should not return instance of user but should return message saying that user does not exist', sinon.test(function (done) {
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

                    done();
                });
        }));

        it('should return an error when an error occurs', sinon.test(function (done) {
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

                    done();
                });
        }));

        it('should not return instance of user but should return message when password does not match', sinon.test(function (done) {
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

                    done();
                });
        }));

        it('should return an instance of user when login is successful', sinon.test(function (done) {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                resolves(loggedUser);

            configPassport.loginUser(null, 'testuser@gmail.com', 'don\'t_tell_anyone',
                function (err, user, msg) {
                    expect(user).to.not.be.null;
                    expect(msg).to.be.null;
                    expect(err).to.be.null;

                    done();
                });
        }));
    });

    describe('Need to be able to SignUp::', function () {
        it.skip('should signup a new user, if the users does not exist already', sinon.test(function (done) {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                resolves(null);

            var saveStub = sinon.stub(new User() , 'save').
                withArgs(sinon.match.any).
                returns({then: function () {
                    return loggedUser;
                }});

            configPassport.signupUser(null, 'testuser@gmail.com', 'don\'t_tell_anyone',
                function (err, user, msg) {
                    sinon.assert.calledOnce(saveStub);
                    expect(user).to.not.be.null;
                    expect(msg).to.be.null;
                    expect(err).to.be.null;

                    done();
                });
        }));

        it.skip('should return a message that user already exist if the email was already used', sinon.test(function (done) {
            UserMock.
                expects('findOne').withArgs(sinon.match.any).
                once().
                chain('exec').
                resolves(null);

            configPassport.signupUser(null, 'testuser@gmail.com', 'don\'t_tell_anyone',
                function (err, user, msg) {
                    expect(user).to.not.be(null);
                    expect(JSON.stringify(msg)).to.contain('Email already existes');
                    expect(err).to.be.null;

                    done();
                });
        }));

        it.skip('should return a message that password is too weak', sinon.test(function () {

        }));

        it.skip('should return an error when it occurs', sinon.test(function () {

        }));

        it.skip('')
    });
});