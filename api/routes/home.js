var express = require('express');
var router = express.Router();
var postsController = require('../controllers/postscontroller');

/* 
- GET    200    http://localhost/posts/1
- GET    200    http://localhost/posts
- POST   201    http://localhost/posts
- PUT    200    http://localhost/posts/1
- DELETE 204    http://localhost/posts/1
*/
router.get('/posts/:postId', postsController.postRead);
router.get('/posts/', postsController.postsList);
router.post('/posts/', postsController.postCreate);
router.put('/posts/:postId', postsController.postUpdate);
router.delete('/posts/:postId', postsController.postDelete);

/* 
- GET    200   http://localhost/posts/1/comments/1 
- GET    200   http://localhost/posts/1/comments
- POST   201   http://localhost/posts/1/comemnts
- PUT    200   http://localhost/posts/1/comments/1
- DELETE 204   http://localhost/posts/1/comments/1
*/
router.get('/posts/:postId/comments/:commentId', postsController.commentRead);
router.get('/posts/:postId/comments/', postsController.commentsList);
router.post('/posts/:postId/comments/', postsController.commentCreate);
router.put('/posts/:postId/comments/:commentId', postsController.commentUpdate);
router.delete('/posts/:postId/comments/:commentId', postsController.commentDelete);

module.exports = router;