/* eslint-disable */
require('../../../api/models/db');
var postController = require('../../../api/controllers/postscontroller');
var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-mongoose');
var mongoose = require('mongoose');

describe('API should expose CRUD operations for POST', function() {

    it.skip('Need to open a post');
    it('Need to lists all post', function(done) {
        var Post = mongoose.model('Post');
        var PostMock = sinon.mock(Post);
        var res = {
            statusValue : -404,
            jsonValue : {},
            json: function(json) {this.jsonValue = json;},
            status: function(status){ this.statusValue = status; },
        };

        PostMock
            .expects('find')
            .chain('exec')
            .yields(null, '[{"_id":"5866eee25f00fe1020d668d5","title":"cccccccccccccc","content":"ccccccccccccccccccccccc","__v":2,"comments":[{"content":"ddddddddddd","author":"ddddddddddd","_id":"5866eeea5f00fe1020d668d6","date":"2016-12-30T23:34:02.000Z"},{"content":"a","author":"a","_id":"586acbcd83e47e2240e4bec6","date":"2017-01-02T21:53:17.916Z"}],"date":"2016-12-30T23:33:54.217Z"}]');

        postController.postsList(null, res, null);

        expect(res).to.not.equal(null && {});
        expect(res.statusValue).to.be.equal(200);
        expect(res.jsonValue.length).to.be.greaterThan(0);

        console.log(res.jsonValue);

        PostMock.verify();
        PostMock.restore();
        done();
    });

    it.skip('Need to be able to create a new post');
    it.skip('Need to be able to update an existing post');
    it.skip('Need to be able to delete an existing post');
});


// router.get('/posts/:postId', postsController.postRead);
// router.get('/posts/', postsController.postsList);
// router.post('/posts/', postsController.postCreate);
// router.put('/posts/:postId', postsController.postUpdate);
// router.delete('/posts/:postId', postsController.postDelete);