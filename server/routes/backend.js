var express = require('express');
var router = express.Router();
var backendController = require('../controllers/backendcontroller')

/* GET users listing. */
router.get('/post/new', backendController.addPost);
router.post('/post/new', backendController.doAddPost, backendController.addPost);

module.exports = router;
