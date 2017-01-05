/* eslint-disable */

// process.env.NODE_CONFIG_DIR = __dirname + '\\..\\..\\..\\config';

// require('sinon-mongoose');
// var expect = require('chai').expect;
// var request = require('supertest');
// var server = require('../../../app');
// var sinon = require('sinon');
// var mongoose = require('mongoose');

// describe('Home pages functionality', function() {
//     it.skip('Need to open default page with all available posts', function(done) {
//         var Post = mongoose.model('Post');
//         var PostMock = sinon.mock(Post);

//         PostMock
//             .expects('find')
//             .chain('exec')
//             .yields(null, '[{"_id":"5866eee25f00fe1020d668d5","title":"cccccccccccccc","content":"ccccccccccccccccccccccc","__v":2,"comments":[{"content":"ddddddddddd","author":"ddddddddddd","_id":"5866eeea5f00fe1020d668d6","date":"2016-12-30T23:34:02.000Z"},{"content":"a","author":"a","_id":"586acbcd83e47e2240e4bec6","date":"2017-01-02T21:53:17.916Z"}],"date":"2016-12-30T23:33:54.217Z"}]');

//         request(server)
//             .get('/')
//             .expect(200)
//             .end(function(err, res) {
//                 console.log('a ' + JSON.stringify(res));
//             });

//         PostMock.verify();
//         PostMock.restore();
//         done();
//     });

//     it.skip('Need to see the link to About page');
//     it.skip('Need to see the link to Post page');
//     it.skip('Need to see the link to New Post page');
// });



// // var sinon = require('sinon');
// // var assert = require('assert');

// // require('../../../api/models/posts.js');
// // var mongoose = require('mongoose');
// // var Post = mongoose.model('Post');


// // require('sinon-mongoose');

// // suite('Get all posts', function () {
// //     test('Should return all posts', function (done) {
// //         var postMock = sinon.mock(Post);
// //         var postDate = Date.now;
// //         var expectedResult = {
// //             title : 'New post',
// //             content : 'Tempor do voluptate adipisicing tempor et reprehenderit et.',
// //             date : postDate,
// //             comments : null
// //         };

// //         postMock.expects('find').yields(null, expectedResult);
// //         Post.find(function (err, result) {
// //             postMock.verify();
// //             postMock.restore();
// //             assert.equal(result.title, 'New post', 'Title of the post should be "New post"');
// //             assert.equal(result.content, 'Tempor do voluptate adipisicing tempor et reprehenderit et.', 'Content must be set.');
// //             assert.equal(result.date, postDate);
// //             assert.equal(result.comments, null, 'No comments');
// //             done();
// //         });
// //     });
// //     test('Should return an error', function (done) {
// //         var postMock = sinon.mock(Post);
// //         var postDate = Date.now;
// //         var expectedResult = {
// //             title : 'New post',
// //             content : 'Tempor do voluptate adipisicing tempor et reprehenderit et.',
// //             date : postDate,
// //             comments : null
// //         };
// //         postMock.expects('find').yields(null, expectedResult);        
// //         Post.find(function (err, result) {
// //             postMock.verify();
// //             postMock.restore();
// //             assert.notEqual(result.title, 'Post');
// //             assert.notEqual(result.content, 'Diffrent content');
// //             assert.notEqual(result.date, Date.now());
// //             assert.notEqual(result.comments, []);
// //             done();
// //         });
// //     }) 
// // });

// // // var homeController = require('../controllers/homecontroller');

// // // describe('Get Index page', function () {
// // //     it('Page must exist and Title must be set to Jenny from the blog', function () {
// // //         homeController.renderUbdex
// // //     });
// // // });


// // suite('#indexOf', function () {

// //     test('it should return -1 if out the range', function () {
// //         assert.equal(-1, [1, 2, 3].indexOf(4));
// //     });
// // });