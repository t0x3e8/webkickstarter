var express = require('express');
var router = express.Router();
var backendController = require('../controllers/backendcontroller')

/* GET users listing. */
router.get('/new', backendController.newPost);
router.post('/new', backendController.newPost);

module.exports = router;
