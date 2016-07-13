var express = require('express');
var router = express.Router();
var homeController = require('../controllers/homecontroller');

/* GET home page. */
router.get('/', homeController.index);
router.get('/about', homeController.about);

module.exports = router;
