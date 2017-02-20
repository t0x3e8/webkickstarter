/* eslint 
    no-unused-vars: ["error", { "argsIgnorePattern": "^next" }],
    max-statements: ["error", { "max" : 14}],
*/

var mongoose = require('mongoose');

var postscontroller = (function () {
    'use strict';

    var returnJSON = function (res, code, data) {
        res.status(code).json(data);
    }

    var Post = mongoose.model('Post');

    var postRead = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findById(req.params.postId).exec(function (err, post) {
                if (post) {
                    returnJSON(res, 200, post);
                } else if (err) {
                    returnJSON(res, 500, { error: err });
                } else {
                    returnJSON(res, 404, { error: 'Post not found' });
                }
            });
        } else {
            returnJSON(res, 400, { error: 'Missing request data (PostId)' });
        }
    };

    // var postRead = function (req, res, next) {
    //     if (req.params && req.params.postId) {
    //         Post.findById(req.params.postId).
    //             exec().
    //             then(function (post) {
    //                 if (post) {
    //                     returnJSON(res, 200, post);
    //                 } else {
    //                     returnJSON(res, 404, { error: 'Post not found' });
    //                 }
    //             }, function (err) {
    //                 if (err) {
    //                     returnJSON(res, 500, { error: err });
    //                 }
    //             });
    //     } else {
    //         returnJSON(res, 400, { error: 'Missing request data (PostId)' });
    //     }
    // };

    var postsList = function (req, res, next) {
        Post.find().sort({ 'date': -1 }).
            exec(function (err, posts) {
                if (posts && posts.length > 0) {
                    returnJSON(res, 200, posts);
                } else if (err) {
                    returnJSON(res, 500, { error: err });
                } else {
                    returnJSON(res, 404, { error: 'Posts not found' });
                }
            });
    };

    var postCreate = function (req, res, next) {
        if (req.body && req.body.title) {
            new Post({
                title: req.body.title,
                content: req.body.content,
                date: Date.now(),
                comments: []
            }).save(function (err, post) {
                if (post) {
                    returnJSON(res, 201, post);
                } else {
                    returnJSON(res, 500, { error: err });
                }
            });
        } else {
            returnJSON(res, 400, { error: 'Missing request data (Title)' });
        }
    };

    var postUpdate = function (req, res, next) {
        var newPost = {};

        if (req.params && req.params.postId) {
            if (req.body.title) {
                newPost.title = req.body.title;
            }
            if (req.body.content) {
                newPost.content = req.body.content;
            }
            newPost.date = Date.now();

            Post.findByIdAndUpdate(req.params.postId, newPost, { new: true }).exec(function (err, post) {
                if (err) {
                    returnJSON(res, 500, { error: err });
                } else {
                    returnJSON(res, 200, post);
                }
            });
        } else {
            returnJSON(res, 400, { error: 'Missing request data (PostId)' });
        }
    };

    var postDelete = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findByIdAndRemove(req.params.postId).exec(function (err) {
                if (err) {
                    returnJSON(res, 500, { error: err });
                } else {
                    returnJSON(res, 204, null);
                }
            });
        } else {
            returnJSON(res, 400, { error: 'Missing request data (PostId)' });
        }
    };

    var commentCreate = function (req, res, next) {
        var comment = {};

        if (req.params && req.params.postId) {
            if (req.body && req.body.content && req.body.author) {
                Post.findById(req.params.postId).
                    exec(function (err, post) {
                        if (post) {
                            post.comments.push({
                                content: req.body.content,
                                author: req.body.author,
                                date: Date.now(),
                            });
                            post.save(function (err2, newPost) {
                                if (err2) {
                                    returnJSON(res, 500, { error: err2 });
                                } else {
                                    comment = newPost.comments[post.comments.length - 1];
                                    returnJSON(res, 201, comment);
                                }
                            });
                        } else if (err) {
                            returnJSON(res, 500, { error: err });
                        } else {
                            returnJSON(res, 404, { error: 'Post not found' });
                        }
                    });
            } else {
                returnJSON(res, 400, { error: 'Missing request data (Content Author)' });
            }
        } else {
            returnJSON(res, 400, { error: 'Missing request data (PostId)' });
        }
    };

    var commentsList = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findById(req.params.postId).
                select('comments').
                exec(function (err, post) {
                    if (post) {
                        if (post.comments && post.comments.length > 0) {
                            returnJSON(res, 200, {
                                postId: req.params.postId,
                                comments: post.comments
                            });
                        } else {
                            returnJSON(res, 404, { error: 'Comments not found' });
                        }
                    } else if (err) {
                        returnJSON(res, 500, { error: err });
                    } else {
                        returnJSON(res, 404, { error: 'Post not found' });
                    }
                });
        } else {
            returnJSON(res, 400, { error: 'Missing request data (PostId)' });
        }
    };
    // var commentRead = function (req, res, next) {
    //     var comment = {};

    //     if (req.params && req.params.postId) {
    //         if (req.params.commentId) {
    //             Post.findById(req.params.postId).
    //                 select('comments').
    //                 exec(function (err, post) {
    //                     if (post) {
    //                         if (post.comments && post.comments.length > 0) {
    //                             comment = post.comments.id(req.params.commentId);

    //                             if (comment) {
    //                                 returnStatus(res, 200, {
    //                                     postId: req.params.postId,
    //                                     comment: comment
    //                                 })
    //                             } else {
    //                                 returnStatus(res, 404, { error: 'Comment not found' });
    //                             }
    //                         } else {
    //                             returnStatus(res, 404, { error: 'Comment not found' });
    //                         }
    //                     } else if (err) {
    //                         returnStatus(res, 404, { error: err });
    //                     } else {
    //                         returnStatus(res, 404, { error: 'Post not found' });
    //                     }
    //                 });
    //         } else {
    //             returnStatus(res, 404, { error: 'Missing CommentId' });
    //         }
    //     } else {
    //         returnStatus(res, 404, { error: 'Missing PostId' });
    //     }
    // };

    // var commentUpdate = function (req, res, next) {
    //     var comment = {};

    //     if (req.params && req.params.postId) {
    //         if (req.params.commentId) {
    //             Post.findById(req.params.postId).
    //                 select('comments').
    //                 exec(function (err, post) {
    //                     if (post) {
    //                         if (post.comments && post.comments.length > 0) {
    //                             comment = post.comments.id(req.params.commentId);
    //                             if (comment) {
    //                                 comment.author = req.body.author;
    //                                 comment.content = req.body.content;
    //                                 comment.date = req.body.date;

    //                                 post.save(function (err2, newPost) {
    //                                     if (newPost) {
    //                                         returnStatus(res, 200, {
    //                                             postId: req.params.postId,
    //                                             comment: newPost.comments.id(req.params.commentId)
    //                                         });
    //                                     } else if (err2) {
    //                                         returnStatus(res, 404, { error: err2 });
    //                                     } else {
    //                                         returnStatus(res, 404, { error: 'Comment not found' });
    //                                     }
    //                                 });
    //                             } else {
    //                                 returnStatus(res, 404, { error: 'Comment not found' });
    //                             }
    //                         } else {
    //                             returnStatus(res, 404, { error: 'Comment not found' });
    //                         }
    //                     } else if (err) {
    //                         returnStatus(res, 404, { error: err });
    //                     } else {
    //                         returnStatus(res, 404, { error: 'Post not found' });
    //                     }
    //                 });
    //         } else {
    //             returnStatus(res, 404, { error: 'Missing CommentId' });
    //         }
    //     } else {
    //         returnStatus(res, 404, { error: 'Missing PostId' });
    //     }
    // };

    // var commentDelete = function (req, res, next) {
    //     if (req.params && req.params.postId) {
    //         if (req.params.commentId) {
    //             Post.findById(req.params.postId).
    //                 select('comments').
    //                 exec(function (err, post) {
    //                     if (post) {
    //                         if (post.comments && post.comments.length > 0) {
    //                             post.comments.id(req.params.commentId).remove();
    //                             post.save(function (err2) {
    //                                 if (err2) {
    //                                     returnStatus(res, 404, { error: err2 });
    //                                 } else {
    //                                     returnStatus(res, 204, null);
    //                                 }
    //                             });
    //                         } else {
    //                             returnStatus(res, 404, { error: 'Comment not found' });
    //                         }
    //                     } else if (err) {
    //                         returnStatus(res, 404, { error: err });
    //                     } else {
    //                         returnStatus(res, 404, { error: 'Post not found' });
    //                     }
    //                 });
    //         } else {
    //             returnStatus(res, 404, { error: 'Missing CommentId' });
    //         }
    //     } else {
    //         returnStatus(res, 404, { error: 'Missing PostId' });
    //     }
    // };

    return {
        'postRead': postRead,
        'postsList': postsList,
        'postCreate': postCreate,
        'postUpdate': postUpdate,
        'postDelete': postDelete,
        'commentsList': commentsList,
        'commentCreate': commentCreate
    };
}());

module.exports = postscontroller;  