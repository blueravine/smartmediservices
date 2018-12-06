const express = require('express');
const router = express.Router();

const alert_controller = require('../controllers/alert.controller');

//create alert 
router.post('/register', alert_controller.alert_create);

//get alert  by field
router.post('/mobile', alert_controller.alerts_bymobile);

//get alert  by field
router.post('/id', alert_controller.alert_retrieve_byid);

//update alert  by field
router.post('/update/mobile', alert_controller.alert_update_bymobile);

//delete alert  by field
router.post('/delete/mobile', alert_controller.alert_delete_bymobile);

//update alert  by field
router.post('/update/id', alert_controller.alert_update_byid);

//delete alert  by field
router.post('/delete/id', alert_controller.alert_delete_byid);

module.exports = router;