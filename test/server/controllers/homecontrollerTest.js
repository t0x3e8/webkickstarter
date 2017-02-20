/* eslint-disable */

// process.env.NODE_CONFIG_DIR = __dirname + '\\..\\..\\..\\config';

var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var server = require('../../../app');
var request = require('request');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var ObjectId = require('mongodb').ObjectID;
var testHelper = require('../../testhelper');

describe('Default page functionality', sinon.test(function () {
    var post1 = new Post({
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
    var post2 = new Post({
        _id: ObjectId("123412341234123412341235"),
        title: 'Post 2',
        content: 'Content of Post 2',
        comments: [],
        date: '2016-12-30T23:33:54.217Z'
    });

    beforeEach(function () {
        testHelper.before();
    });

    afterEach(function () {
        testHelper.after();
    });

    it('Need to open default page with all available posts and links', sinon.test(function (done) {
        var getRequestStub = this.stub(request, 'get')
            .withArgs("http://localhost:3000/api/posts", { json: {} })
            .yields(null, { statusCode: 200 }, [post1, post2]);

        supertest(server)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(getRequestStub.calledOnce).to.be.true;
                expect(res.text).to.contain('Post 1');
                expect(res.text).to.contain('Post 2');
                expect(res.text).to.contain('Jenny from the blog');
                expect(res.text).to.contain('href="/account/post/new">New Post</a>');
                expect(res.text).to.contain('href="/about">About</a>');
                expect(res.text).to.contain('href="/">The blog</a>');
                expect(res.text).to.contain('href="/account/login">Log in</a>');
                expect(res.text).to.contain('href="/account/register">Register</a>');
                expect(res.text).to.contain('href="/post/123412341234123412341234">Post 1</a>');
                // expect(res.text).to.match(/href=\"\/post\/{1}[\d\w]{24}\">Post 1\<\/a\>/);
                expect(res.text).to.contain('href="/post/123412341234123412341235">Post 2</a>');
                // expect(res.text).to.match(/href=\"\/post\/{1}[\d\w]{24}\">Post 2\<\/a\>/);
                expect(res.text).to.not.match(/href=\"\/post\/{1}[\d\w]{24}\">Post 3\<\/a\>/);
                done();
            });
    }));

    it('Need to open default page when no posts available', sinon.test(function (done) {
        var getRequestStub = this.stub(request, 'get')
            .withArgs("http://localhost:3000/api/posts", { json: {} })
            .yields(null, { statusCode: 404 }, '{"error":"Posts not found"}');

        supertest(server)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(getRequestStub.calledOnce).to.be.true;
                expect(res.text).to.contain('Jenny from the blog');
                expect(res.text).to.contain('href="/account/post/new">New Post</a>');
                expect(res.text).to.contain('href="/about">About</a>');
                expect(res.text).to.contain('href="/">The blog</a>');
                done();
            });
    }));

    it('Need to open About page', sinon.test(function (done) {
        supertest(server)
            .get('/about')
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('This is just an example of extremely simple blog build on the foundation of MEAN blocks');
                done();
            });
    }));

    it('Need to open Post 1 details page', sinon.test(function (done) {
        var getRequestStub = this.stub(request, 'get')
            .withArgs("http://localhost:3000/api/posts/123412341234123412341234", { json: {} })
            .yields(null, { statusCode: 200 }, post1);

        supertest(server)
            .get('/post/123412341234123412341234')
            .expect(200)
            .end(function (err, res) {
                expect(getRequestStub.calledOnce).to.be.true;
                expect(res.text).to.contain('Post 1');
                expect(res.text).to.contain('Content of Post 1');
                done();
            });
    }));

    it('Should open "Post 1" in order to add new comment. Need to be authorized.', sinon.test(function (done) {
        var comment = { content: 'New comment' };
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts/123412341234123412341234/comments", sinon.match.any)
            .yields(null, { statusCode: 201 }, post1);
        var appAgent = supertest.agent(server);

        testHelper.makeAgentAuthenticated(appAgent, function () {
            appAgent.
                post('/post/123412341234123412341234').
                send(comment).
                expect(201).
                end(function (err, res) {
                    expect(postRequestStub.calledOnce).to.be.true;
                    done();
                });
        });
    }));

    it('Should open "Post 1" in order to add new comment. Author needs to be provided since user is not logged in.', sinon.test(function (done) {
        var comment = { author: 'new author', content: 'New comment' };
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts/123412341234123412341234/comments", sinon.match.any)
            .yields(null, { statusCode: 201 }, post1);
        var appAgent = supertest.agent(server);

        appAgent.
            post('/post/123412341234123412341234').
            send(comment).
            expect(201).
            end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                done();
            });
    }));

    it('Need to open Error page (404) when the comment\'s details are missing', sinon.test(function (done) {
        var comment = { content: null };
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts/123412341234123412341234/comments", sinon.match.any)
            .yields({ error: 'New Comment must have all fields set' }, { statusCode: 404 }, null);

        supertest(server)
            .post('/post/123412341234123412341234')
            .send(comment)
            .expect(404)
            .end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    }));
}));