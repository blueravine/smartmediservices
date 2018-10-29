const Schema = require('schm');
const Alert = require('../models/alert.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    Alert,
    token: {type: String, default: null},
    responsedate: {type: Date, default: Date.now}
});