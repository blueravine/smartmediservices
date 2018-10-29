const express = require('express');
const router = express.Router();
//Require the controllers
const user_controller = require('../controllers/user.controller');

//test Route
router.get('/test', user_controller.test);

//create user
router.post('/register', user_controller.user_create);

//create user
router.post('/login', user_controller.user_authenticate);

//verify user token
router.post('/token/verify', user_controller.user_verify_token);

//get user by id
router.get('/:id', user_controller.user_details);

//get user by field
router.post('/mobile', user_controller.user_details_bymobile);

//update user by field
router.put('/mobile', user_controller.user_update_bymobile);

module.exports = router;