/* eslint-disable */

process.env.NODE_CONFIG_DIR = __dirname + '\\..\\..\\..\\config';

var expect = require('chai').expect;
var request = require('supertest');
var server = require('../../../app');

describe('Home pages functionality', function() {
    it.skip('Need to open default page with all available posts', function(done) {
        request(server)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                console.log('a ' + JSON.stringify(res));
            });
    });

    it.skip('Need to see the link to About page');
    it.skip('Need to see the link to Post page');
    it.skip('Need to see the link to New Post page');
});



// var sinon = require('sinon');
// var assert = require('assert');

// require('../../../api/models/posts.js');
// var mongoose = require('mongoose');
// var Post = mongoose.model('Post');


// require('sinon-mongoose');

// suite('Get all posts', function () {
//     test('Should return all posts', function (done) {
//         var postMock = sinon.mock(Post);
//         var postDate = Date.now;
//         var expectedResult = {
//             title : 'New post',
//             content : 'Tempor do voluptate adipisicing tempor et reprehenderit et.',
//             date : postDate,
//             comments : null
//         };

//         postMock.expects('find').yields(null, expectedResult);
//         Post.find(function (err, result) {
//             postMock.verify();
//             postMock.restore();
//             assert.equal(result.title, 'New post', 'Title of the post should be "New post"');
//             assert.equal(result.content, 'Tempor do voluptate adipisicing tempor et reprehenderit et.', 'Content must be set.');
//             assert.equal(result.date, postDate);
//             assert.equal(result.comments, null, 'No comments');
//             done();
//         });
//     });
//     test('Should return an error', function (done) {
//         var postMock = sinon.mock(Post);
//         var postDate = Date.now;
//         var expectedResult = {
//             title : 'New post',
//             content : 'Tempor do voluptate adipisicing tempor et reprehenderit et.',
//             date : postDate,
//             comments : null
//         };
//         postMock.expects('find').yields(null, expectedResult);        
//         Post.find(function (err, result) {
//             postMock.verify();
//             postMock.restore();
//             assert.notEqual(result.title, 'Post');
//             assert.notEqual(result.content, 'Diffrent content');
//             assert.notEqual(result.date, Date.now());
//             assert.notEqual(result.comments, []);
//             done();
//         });
//     }) 
// });

// // var homeController = require('../controllers/homecontroller');

// // describe('Get Index page', function () {
// //     it('Page must exist and Title must be set to Jenny from the blog', function () {
// //         homeController.renderUbdex
// //     });
// // });


// suite('#indexOf', function () {

//     test('it should return -1 if out the range', function () {
//         assert.equal(-1, [1, 2, 3].indexOf(4));
//     });
// });