var express = require('express');
var router = express.Router();
var backendController = require('../controllers/backendcontroller')

/* GET users listing. */
router.get('/post/new', backendController.addPost);
router.post('/post/new', backendController.doAddPost, backendController.addPost);
router.get('/login', backendController.login);
router.get('/register', backendController.register);

module.exports = router;
