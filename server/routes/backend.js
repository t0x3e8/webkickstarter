var express = require('express');
var router = express.Router();
var backendController = require('../controllers/backendcontroller')

/* GET users listing. */
router.get('/', backendController.index);

module.exports = router;
