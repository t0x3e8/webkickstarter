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

describe('Backend page functionality', function () {
    var post1, post2;

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
    });

    it('Need to open add new post page', sinon.test(function (done) {
        supertest(server)
            .get('/admin/post/new')
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
            .yields(null, {statusCode :201}, newPost);

        supertest(server)
            .post('/admin/post/new')
            .send(newPost)
            .expect(201)
            .end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                expect(res.text).to.contain('Saved');
                expect(res.text).to.not.contain('Did not save');
                done();
            });
    }));

    it('Need to add a new post with failure', sinon.test(function (done) {
        var newPost = { title: '', content: '' };
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts", { json: newPost })
            .yields(null, {statusCode : 400}, { error: 'Missing request data (Title)' });

        supertest(server)
            .post('/admin/post/new')
            .send(newPost)
            .expect(400)
            .end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                expect(res.text).to.not.contain('Saved');
                expect(res.text).to.contain('Did not save');
                done();
            });
    }));
});