/* eslint-disable */

// process.env.NODE_CONFIG_DIR = __dirname + '\\..\\..\\..\\config';

var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var server = require('../../../app');
var request = require('request');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var util = require('util');

describe('Backend page functionality', function () {
    var post1, post2, registeredUser, UserMock;

    beforeEach(function () {
        post1 = new Post({
            _id: ObjectId("123412341234123412341234"),
            title: 'Post 1',
            content: 'Content of Post 1',
            comments: [{
                content: 'Good',
                author: 'Jarek',
                _id: 'c1',
                date: '2016-12-30T23:34:02.000Z'
            }, {
                content: 'Bad',
                author: 'Filip',
                _id: 'c2',
                date: '2017-01-02T21:53:17.916Z'
            }],
            date: '2016-10-30T23:33:54.217Z'
        });

        post2 = new Post({
            _id: ObjectId("123412341234123412341235"),
            title: 'Post 2',
            content: 'Content of Post 2',
            comments: [],
            date: '2016-12-30T23:33:54.217Z'
        });

        registeredUser = new User({
            'local.email': 'email@gmail.com',
            'local.password': "$2a$08$LCVeYC1V27HQCPND3u61TOSjeFl3HpWd50Bjk4tBmRji/N/aeRrmu"
        });

        UserMock = sinon.mock(User);
    });

    afterEach(function () {
        UserMock.restore();
    });

    it('Need to open add new post page', sinon.test(function (done) {
        supertest(server)
            .get('/account/post/new')
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('<title>New Post</title>');
                expect(res.text).to.match(/\<input{1}.*id=\"title\"{1}/);
                expect(res.text).to.match(/\<textarea{1}.*id=\"content\"{1}/);
                done();
            });
    }));

    it('Need to add a new post with success', sinon.test(function (done) {
        var newPost = { title: 'New Post', content: 'New Content' };
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts", { json: newPost })
            .yields(null, { statusCode: 201 }, newPost);

        supertest(server)
            .post('/account/post/new')
            .send(newPost)
            .expect(201)
            .end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                expect(res.text).to.contain('Saved');
                expect(res.text).to.not.contain('Did not save');
                done();
            });
    }));

    it('Need to be redirected if the user is not authenticated', sinon.test(function (done) {
        var newPost = { title: 'New Post', content: 'New Content' };

        supertest(server)
            .post('/account/post/new')
            .send(newPost)
            .expect(302)
            .expect('Location', '/login')
            .end(function (err, res) {
                if (err)
                    done(err);
                else
                    done();
            });
    }));

    it('Need to add a new post with failure', sinon.test(function (done) {
        var newPost = { title: '', content: '' };
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts", { json: newPost })
            .yields(null, { statusCode: 400 }, { error: 'Missing request data (Title)' });

        supertest(server)
            .post('/account/post/new')
            .send(newPost)
            .expect(400)
            .end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                expect(res.text).to.not.contain('Saved');
                expect(res.text).to.contain('Did not save');
                done();
            });
    }));

    it('Need to open Login page', sinon.test(function (done) {
        supertest(server)
            .get('/account/login')
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('Email:');
                expect(res.text).to.contain('Password:');
                done();
            });
    }));

    it('Need to open Register page', sinon.test(function (done) {
        supertest(server)
            .get('/account/register')
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('Display name:');
                expect(res.text).to.contain('Email:');
                expect(res.text).to.contain('Password:');
                expect(res.text).to.contain('Retype password:');
                done();
            });
    }));

    it('Need to log in an user with email and password', sinon.test(function (done) {
        UserMock.
            expects('findOne').withArgs(sinon.match.any).
            once().
            chain('exec').
            resolves(registeredUser);

        supertest.agent(server)
            .post('/account/login')
            .send({ password: 'don\'t_tell_anyone', password2: 'don\'t_tell_anyone', email: 'email@gmail.com' })
            .expect(302)
            .expect('Location', '/')
            .end(function (err, res) {
                if (err)
                    done(err);
                else
                    done();
            });
    }));

    it('Need to register a new user with email, password and retyped password', sinon.test(function (done) {
        UserMock.
            expects('findOne').withArgs(sinon.match.any).
            once().
            chain('exec').
            resolves(null);

        // SAVE AS PROMISE - does not work !!!!
        var saveStub = sinon.stub(User.prototype, 'save', function (cb) {
            cb(null, registeredUser)
        });

        supertest.agent(server)
            .post('/account/register')
            .send({ password: 'secretpassword', password2: 'secretpassword', email: 'email@gmail.com', username: 'user name' })
            .expect(302)
            .expect('Location', '/')
            .end(function (err, res) {
                if (err)
                    done(err);
                else
                    done();
            });
    }));
});