module.exports = function (router) {
    'use strict'

    var homeController = require('../controllers/homecontroller');

    /* GET home page. */
    router.get('/', homeController.index);
    router.get('/post/:postId', homeController.postDetails);
    router.post('/post/:postId', homeController.addComment);
    router.get('/about', homeController.about);

    return router;
}