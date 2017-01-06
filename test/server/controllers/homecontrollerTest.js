/* eslint-disable */

// process.env.NODE_CONFIG_DIR = __dirname + '\\..\\..\\..\\config';

var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var server = require('../../../app');
var request = require('request');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

describe('Default page functionality', function () {
    var post1, post2;

    beforeEach(function () {
        post1 = new Post({
            _id: '1',
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
            _id: '2',
            title: 'Post 2',
            content: 'Content of Post 2',
            comments: [],
            date: '2016-12-30T23:33:54.217Z'
        });
    });

    it('Need to open default page with all available posts', sinon.test(function (done) {
        var getRequestStub = this.stub(request, 'get')
            .withArgs("http://localhost:3000/api/posts", {json : { } })
            .yields(null, {statusCode : 200}, [post1, post2]);
        var body = {};

        supertest(server)
            .get('/')
            .expect(200)
            .expect('cache-control', 'no-cache')
            .end(function (err, res) {

                expect(getRequestStub.calledOnce).to.be.true;
                expect(res.text).to.contain('Post 1');
                expect(res.text).to.contain('Post 2');
                expect(res.text).to.contain('Jenny from the blog');
                done();
            });
    }));

    it.skip('Need to see the link to About page');
    it.skip('Need to see the link to Post page');
    it.skip('Need to see the link to New Post page');
});