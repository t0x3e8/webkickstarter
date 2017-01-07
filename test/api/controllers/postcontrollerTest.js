/* eslint-disable */ 

require('../../../api/models/db');
require('sinon-mongoose');

var postController = require('../../../api/controllers/postscontroller');
var expect = require('chai').expect;
var sinon = require('sinon');
var mongoose = require('mongoose');
var httpMocks = require('node-mocks-http');

describe('TDD for api\\controllers\\postcontroller::', function () {
    var Post = mongoose.model('Post');
    var res = req = resData = post1WithComments = post2WithoutComments = null;

    beforeEach(function () {
        res = httpMocks.createResponse();
        post1WithComments = new Post({
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
        post2WithoutComments = new Post({
            _id: '2',
            title: 'Post 2',
            content: 'Content of Post 2',
            comments: [],
            date: '2016-12-30T23:33:54.217Z'
        });

    });

    describe('API should expose CRUD operations for POST::', function () {
        describe('Need to be able to LIST posts::', function () {
            it('should return available posts', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('find')
                    .once()
                    .chain('exec')
                    .yields(null, [post1WithComments, post2WithoutComments]);

                postController.postsList(null, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(200);
                expect(resData.length).to.be.equal(2);
            }));

            it('should return 404 and an error when no posts', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('find')
                    .once()
                    .chain('exec')
                    .yields(null, {});

                postController.postsList(null, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(404);
                expect(res._getData()).to.be.equal('{"error":"Posts not found"}');
            }));

            it('should return 404 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('find')
                    .once()
                    .chain('exec')
                    .yields("Error happened", null);

                postController.postsList(null, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));
        });

        describe('Need to be able to CREATE a new post::', function () {
            it('should create a new post', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('create')
                    .once()
                    .chain('exec')
                    .yields(null, post2WithoutComments);
                req = httpMocks.createRequest({ body: { title: "Post 2", content: "Content of Post 2" } });

                postController.postCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(201);
                expect(resData.title).to.be.equal("Post 2");
                expect(resData.content).to.be.equal("Content of Post 2");
                expect(resData.date).to.be.equal('2016-12-30T23:33:54.217Z');
                expect(resData.comments.length).to.be.equal(0);
            }));

            it('should return an error when Title is missing', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('create')
                    .never()
                    .chain('exec')
                    .yields(null, null);
                req = httpMocks.createRequest({ body: { title: undefined, content: undefined } });

                postController.postCreate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (Title)"}');
            }));

            it('should return 500 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('create')
                    .once()
                    .chain('exec')
                    .yields("Error happened", null);
                req = httpMocks.createRequest({ body: { title: "Post 2", content: "Content of Post 2" } });

                postController.postCreate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));
        });

        describe('Need to be able to GET a single post::', function () {
            it('should get the post', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null, post2WithoutComments);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.postRead(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(200);
                expect(resData.title).to.be.equal("Post 2");
                expect(resData.content).to.be.equal("Content of Post 2");
                expect(resData.date).to.be.equal('2016-12-30T23:33:54.217Z');
                expect(resData.comments.length).to.be.equal(0);
            }));

            it('should return 404 and an error when post it is not found', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null, null);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.postRead(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(404);
                expect(res._getData()).to.be.equal('{"error":"Post not found"}');
            }));

            it('should return 500 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields("Error happened", null);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.postRead(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));

            it('should return 400 and an error when PostId is missing', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .never()
                    .chain('exec')
                    .yields(null, null);
                req = httpMocks.createRequest();

                postController.postRead(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (PostId)"}');
            }));
        });

        describe('Need to be able to DELETE an existing post::', function () {
            it('should delete the post', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findByIdAndRemove').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.postDelete(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(204);
                expect(res._getData()).to.be.equal('');
            }));

            it('should return 500 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findByIdAndRemove').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields("Error happened");
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.postDelete(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));

            it('should return 400 and an error when PostId is missing', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findByIdAndRemove').withArgs(1)
                    .never()
                    .chain('exec')
                    .yields(null);
                req = httpMocks.createRequest();

                postController.postDelete(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (PostId)"}');
            }));
        });

        describe('Need to be able to UPDATE an existing post::', function () {
            it('should update the post', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findByIdAndUpdate').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null, post2WithoutComments);
                req = httpMocks.createRequest({ params: { postId: 1 }, body: { title: "Post Updated", content: "Post Content Updated" } });

                postController.postUpdate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(200);
            }));

            it('should return 500 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findByIdAndUpdate').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields("Error happened");
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.postUpdate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));

            it('should return 400 and an error when PostId is missing', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findByIdAndUpdate').withArgs(1)
                    .never()
                    .chain('exec')
                    .yields(null);
                req = httpMocks.createRequest();

                postController.postUpdate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (PostId)"}');
            }));
        });
    });

    describe('API should expose CRUD operations for COMMENTS::', function () {
        describe('Need to be able to LIST all comments for a given Post::', function () {
            it('should return available comments', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('select').withArgs('comments')
                    .chain('exec')
                    .yields(null, post1WithComments);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.commentsList(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(200);
                expect(resData.postId).to.be.equal(1);
                expect(resData.comments.length).to.be.equal(2);
            }));

            it('should return 404 and an error when post is not found', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('select').withArgs('comments')
                    .chain('exec')
                    .yields(null, null);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.commentsList(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(404);
                expect(res._getData()).to.be.equal('{"error":"Post not found"}');
            }));

            it('should return 404 and an error when post is found but no comments', sinon.test(function () {
                post1WithComments.comments = [];

                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('select').withArgs('comments')
                    .chain('exec')
                    .yields(null, post1WithComments);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.commentsList(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(404);
                expect(res._getData()).to.be.equal('{"error":"Comments not found"}' );
            }));

            it('should return 500 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('select').withArgs('comments')
                    .chain('exec')
                    .yields("Error happened", null);
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.commentsList(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));

            it('should return 400 and an error when PostId is missing', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .never()
                    .chain('exec')
                    .yields(null);
                req = httpMocks.createRequest();

                postController.commentsList(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (PostId)"}');
            }));
        });

        describe('Need to be able to CREATE a new comment::', function () {
            it('should create a new comment', sinon.test(function () {
                var newComment = { content: "Comment number 1", author: "Author 1" };

                var postWithNewComment = post1WithComments;
                postWithNewComment.comments.push(newComment);

                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null, post1WithComments);
                // you must stub the method on the instance of PostMock object see:http://stackoverflow.com/questions/21072016/stubbing-a-class-method-with-sinon-js#21079440
                this.stub(post1WithComments, 'save', function (cb) { cb(null, postWithNewComment) });

                req = httpMocks.createRequest({ params: { postId: 1 }, body: newComment });

                postController.commentCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(201);
                expect(resData.author).to.be.equal("Author 1");
                expect(resData.content).to.be.equal("Comment number 1");
            }));

            it('should return 500 and an error when an error occurs while saving', sinon.test(function () {
                var newComment = { content: "Comment number 1", author: "Author 1" };

                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null, post1WithComments);
                // you must stub the method on the instance of PostMock object see:http://stackoverflow.com/questions/21072016/stubbing-a-class-method-with-sinon-js#21079440
                this.stub(post1WithComments, 'save', function (cb) { cb('Error while formating') });

                req = httpMocks.createRequest({ params: { postId: 1 }, body: newComment });

                postController.commentCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error while formating"}');
            }));

            it('should return 500 and an error when an error occurs while finding post', sinon.test(function () {
                var newComment = { content: "Comment number 1", author: "Author 1" };
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields("Error happened");

                req = httpMocks.createRequest({ params: { postId: 1 }, body: newComment });

                postController.commentCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));

            it('should return 404 and an error when post not found', sinon.test(function () {
                var newComment = { content: "Comment number 1", author: "Author 1" };
                var PostMock = this.mock(Post);
                PostMock
                    .expects('findById').withArgs(1)
                    .once()
                    .chain('exec')
                    .yields(null, null);

                req = httpMocks.createRequest({ params: { postId: 1 }, body: newComment });

                postController.commentCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(404);
                expect(res._getData()).to.be.equal('{"error":"Post not found"}');
            }));

            it('should return 400 and an error when comments fields are missing', sinon.test(function () {
                req = httpMocks.createRequest({ params: { postId: 1 } });

                postController.commentCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (Content Author)"}');
            }));

            it('should return 400 and an error when PostId is missing', sinon.test(function () {
                req = httpMocks.createRequest();

                postController.commentCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (PostId)"}');
            }));
        });
    });
});