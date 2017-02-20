module.exports = function (router) {
    'use strict'

    var postsController = require('../controllers/postscontroller');

    /* 
    - GET    200    http://localhost/api/posts/1
    - GET    200    http://localhost/api/posts
    - POST   201    http://localhost/api/posts
    - PUT    200    http://localhost/api/posts/1
    - DELETE 204    http://localhost/api/posts/1
    */
    router.get('/posts/:postId', postsController.postRead);
    router.get('/posts/', postsController.postsList);
    router.post('/posts/', postsController.postCreate);
    router.put('/posts/:postId', postsController.postUpdate);
    router.delete('/posts/:postId', postsController.postDelete);

    /* 
    - GET    200   http://localhost/api/posts/1/comments/1 
    - POST   201   http://localhost/api/posts/1/comemnts
    */
    // router.get('/posts/:postId/comments/:commentId', postsController.commentRead);
    router.get('/posts/:postId/comments/', postsController.commentsList);
    router.post('/posts/:postId/comments/', postsController.commentCreate);
    // router.put('/posts/:postId/comments/:commentId', postsController.commentUpdate);
    // router.delete('/posts/:postId/comments/:commentId', postsController.commentDelete);

    return router;
}