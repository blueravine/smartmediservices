const express = require('express');
const router = express.Router();
//Require the controllers
const secretquestion_controller = require('../controllers/secretquestion.controller');

//test Route
router.get('/test', secretquestion_controller.test);

//create secretquestion
router.post('/register', secretquestion_controller.secretquestion_create);

//retrieve secretquestions
router.get('/retrieve', secretquestion_controller.secretquestion_retrieve);

module.exports = router;