const express = require('express');
const router = express.Router();

const test_controller = require('../controllers/test.controller');

//create test 
router.post('/register', test_controller.test_create);

//get test  by field
router.post('/name', test_controller.tests_byname);

module.exports = router;