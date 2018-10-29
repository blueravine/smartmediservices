const express = require('express');
const router = express.Router();

const alert_controller = require('../controllers/alert.controller');

//create alert 
router.post('/register', alert_controller.alert_create);

//get alert  by field
router.post('/mobile', alert_controller.alerts_bymobile);

module.exports = router;