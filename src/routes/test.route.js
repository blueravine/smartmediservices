const express = require('express');
const router = express.Router();

const test_controller = require('../controllers/test.controller');

//create test 
router.post('/register', test_controller.test_create);

//get test  by name
router.post('/name', test_controller.tests_byname);

//get all tests
router.post('/', test_controller.tests_all);

//update test by name
router.post('/update/name', test_controller.test_update_byname);

//delete test by name
router.post('/delete/name', test_controller.test_delete_byname);

module.exports = router;