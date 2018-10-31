const express = require('express');
const router = express.Router();

const test_controller = require('../controllers/test.controller');

//create test 
router.post('/register', test_controller.test_create);

//get test  by name
router.post('/name', test_controller.tests_byname);

//update test by name
router.post('/update/name', test_controller.test_update_byname);

module.exports = router;