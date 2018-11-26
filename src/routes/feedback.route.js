const express = require('express');
const router = express.Router();
//Require the controllers
const feedback_controller = require('../controllers/feedback.controller');

//test Route
router.get('/test', feedback_controller.test);

//create feedback
router.post('/register', feedback_controller.feedback_create);

module.exports = router;