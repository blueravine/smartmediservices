const express = require('express');
const router = express.Router();

const alert_controller = require('../controllers/alert.controller');

//create alert 
router.post('/register', alert_controller.alert_create);

//get alert  by field
router.post('/mobile', alert_controller.alerts_bymobile);

//update alert  by field
router.post('/update/mobile', alert_controller.alert_update_bymobile);

//delete alert  by field
router.post('/delete/mobile', alert_controller.alert_delete_bymobile);

module.exports = router;