const express = require('express');
const router = express.Router();

const testresult_controller = require('../controllers/testresult.controller');

//test Route
router.get('/test', testresult_controller.test);

//create test result
router.post('/register', testresult_controller.testresult_create);

//get test result by field
router.post('/mobile', testresult_controller.testresults_bymobile);

module.exports = router;