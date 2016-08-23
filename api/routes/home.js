var express = require('express');
var router = express.Router();
var postsController = require('../controllers/postscontroller');

/* 
- GET       http://localhost/posts/1
- GET       http://localhost/posts
- POST      http://localhost/posts
- PUT       http://localhost/posts/1
- DELETE    http://localhost/posts/1
*/
router.get('/posts/:postId', postsController.postRead);
router.get('/posts/', postsController.postsList);
router.post('/posts/', postsController.postCreate);
router.put('/posts/:postId', postsController.postUpdate);
router.delete('/posts/:postId', postsController.postDelete);

/* 
- GET       http://localhost/posts/1/comments/1
- GET       http://localhost/posts/1/comments
- POST      http://localhost/posts/1/comemnts
- PUT       http://localhost/posts/1/comments/1
- DELETE    http://localhost/posts/1/comments/1
*/
router.get('/posts/:postId/comments/:commentId', postsController.commentRead);
router.get('/posts/:postId/comments/', postsController.commentsList);
router.post('/posts/:postId/comments/', postsController.commentCreate);
router.put('/posts/:postId/comments/:commentId', postsController.commentUpdate);
router.delete('/posts/:postId/comments/:commentId', postsController.commentDelete);

module.exports = router;