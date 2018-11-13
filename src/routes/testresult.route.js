const express = require('express');
const router = express.Router();

const testresult_controller = require('../controllers/testresult.controller');

//test Route
router.get('/test', testresult_controller.test);

//create test result
router.post('/register', testresult_controller.testresult_create);

//get test result by field
router.post('/mobile', testresult_controller.testresults_bymobile);

//update test result by mobile
router.post('/update/mobile', testresult_controller.testresults_update_bymobile);

//delete test result by mobile
router.post('/delete/mobile', testresult_controller.testresults_delete_bymobile);

module.exports = router;