/* eslint 
    no-unused-vars: ["error", { "argsIgnorePattern": "^next" }],
    max-statements: ["error", { "max" : 14}]
*/

var mongoose = require('mongoose');

var homecontroller = (function () {
    'use strict';

    var returnStatus = function (res, status, jsonData) {
        res.status(status);
        res.json(jsonData);
    }

    var Post = mongoose.model('Post');
    
    var postRead = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findById(req.params.postId).exec(function (err, post) {
                if (post) {
                    returnStatus(res, 200, post);
                } else if (err) {
                    returnStatus(res, 404, {error : err});
                } else {
                    returnStatus(res, 404, {error: 'Post not found'});
                }
            });
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    var commentRead = function (req, res, next) {
        var comment = {};

        if (req.params && req.params.postId) {
            if (req.params.commentId) {
                Post.findById(req.params.postId).
                select('comments').
                exec(function (err, post) {
                    if (post) {
                        if (post.comments && post.comments.length > 0) {
                            comment = post.comments.id(req.params.commentId);

                            if (comment) {
                                returnStatus(res, 200, {
                                    postId : req.params.postId, 
                                    comment : comment
                                })
                            } else {
                                returnStatus(res, 404, {error : 'Comment not found'});
                            }
                        } else {
                            returnStatus(res, 404, {error :'Comment not found'});
                        }
                    } else if (err) {
                        returnStatus(res, 404, {error : err});
                    } else {
                        returnStatus(res, 404, {error: 'Post not found'});
                    }
                });
            } else {            
                returnStatus(res, 404, {error : 'Missing CommentId'});                
            }
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    var postsList = function (req, res, next) {
        Post.find().exec(function (err, posts) {
            if (posts || posts.length > 0) {
                returnStatus(res, 200, posts);
            } else if (err) {
                returnStatus(res, 404, {error: err});
            } else {
                returnStatus(res, 404, {error: 'Posts not found'});
            }
        });
    };

    var commentsList = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findById(req.params.postId).
            select('comments').
            exec(function (err, post) {
                if (post) {
                    if (post.comments && post.comments.length > 0) {
                        returnStatus(res, 200, {
                            postId : req.params.postId, 
                            comments: post.comments
                        });
                    } else {
                        returnStatus(res, 404, {error:'No comments found'});
                    }
                } else if (err) {
                    returnStatus(res, 404, {error : err});
                } else {
                    returnStatus(res, 404, {error: 'Post not found'});
                }
            });
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});            
        }
    };

    var postCreate = function (req, res, next) {
        if (req.body && req.body.title) {
            Post.create({
                title : req.body.title,
                content: req.body.content,
                date : Date.now(),
                comments : []
            }, function (err, post) {
                if (err) {
                    returnStatus(res, 404, {error: err});
                } else {
                    returnStatus(res, 201, post);
                }
            });
        } else {
            returnStatus(res, 404, {error : 'Post Title is required'});
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
                            content : req.body.content,
                            author : req.body.author,
                            date : Date.now(),
                        });
                        post.save(function (err2, newPost) {
                            if (err2) {
                                returnStatus(res, 404, err2);
                            } else {
                                comment = newPost.comments[post.comments.length - 1];
                                returnStatus(res, 201, comment);
                            }
                        });
                    } else if (err) {
                        returnStatus(res, 404, {error: err});
                    } else {
                        returnStatus(res, 404, {error: 'Post not found'});                        
                    }
                });
            } else {
                returnStatus(res, 404, {error : 'New Comment must have all fields set'});
            }
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    var postUpdate = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findById(req.params.postId).exec(function (err, post) {
                if (post) {
                    post.title = req.body.title;
                    post.content = req.body.content;
                    post.date = req.body.date;
                    // post.comments = req.body.comments;
                    post.save(function (err2, updatedPost) {
                        if (err2) {
                            returnStatus(res, 404, {error : err2});
                        } else {
                            returnStatus(res, 200, updatedPost);
                        }
                    }); 

                } else if (err) {
                    returnStatus(res, 404, {error : err});
                } else {
                    returnStatus(res, 404, {error: 'Post not found'});                                        
                }
            });
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    var commentUpdate = function (req, res, next) {
        var comment = {};
        
        if (req.params && req.params.postId) {
            if (req.params.commentId) {
                Post.findById(req.params.postId).
                select('comments').
                exec(function (err, post) {
                    if (post) {
                        if (post.comments && post.comments.length > 0) {                            
                            comment = post.comments.id(req.params.commentId);
                            if (comment) {
                                comment.author = req.body.author;
                                comment.content = req.body.content;
                                comment.date = req.body.date;

                                post.save(function (err2, newPost) {
                                    if (newPost) {
                                        returnStatus(res, 200, {
                                            postId : req.params.postId,
                                            comment : newPost.comments.id(req.params.commentId)
                                        });
                                    } else if (err2) { 
                                        returnStatus(res, 404, {error : err2});
                                    } else {
                                        returnStatus(res, 404, {error: 'Comment not found'});
                                    }
                                });
                            } else {
                                returnStatus(res, 404, {error: 'Comment not found'});
                            }                          
                        } else {
                            returnStatus(res, 404, {error: 'Comment not found'});
                        }
                    } else if (err) {
                        returnStatus(res, 404, {error : err});
                    } else {
                        returnStatus(res, 404, {error: 'Post not found'});
                    }
                });
            } else {
                returnStatus(res, 404, {error: 'Missing CommentId'});
            }        
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    var postDelete = function (req, res, next) {
        if (req.params && req.params.postId) {
            Post.findByIdAndRemove(req.params.postId).exec(function (err) {
                if (err) { 
                    returnStatus(res, 404, {error : err});
                } else {
                    returnStatus(res, 204, null);
                }
            });
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    var commentDelete = function (req, res, next) {
        if (req.params && req.params.postId) {
            if (req.params.commentId) {
                Post.findById(req.params.postId).
                select('comments').
                exec(function (err, post) {
                    if (post) {
                        if (post.comments && post.comments.length > 0) {
                            post.comments.id(req.params.commentId).remove();
                            post.save(function (err2) {
                                if (err2) {
                                    returnStatus(res, 404, {error:err2});
                                } else {
                                    returnStatus(res, 204, null);
                                }
                            });
                        } else {
                            returnStatus(res, 404, {error : 'Comment not found'});
                        }
                    } else if (err) {
                        returnStatus(res, 404, {error : err});
                    } else {
                        returnStatus(res, 404, {error: 'Post not found'});
                    }
                });
            } else {
                returnStatus(res, 404, {error:'Missing CommentId'});
            }
        } else {
            returnStatus(res, 404, {error : 'Missing PostId'});
        }
    };

    return {
        'postRead' : postRead,
        'postsList' : postsList,
        'postCreate' : postCreate,
        'postUpdate' : postUpdate,
        'postDelete' : postDelete,
        'commentRead' : commentRead,
        'commentsList' : commentsList,
        'commentCreate' : commentCreate,
        'commentUpdate' : commentUpdate,
        'commentDelete' : commentDelete
    };
}());

module.exports = homecontroller;  