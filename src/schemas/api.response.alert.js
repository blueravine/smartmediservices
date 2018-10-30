const Schema = require('schm');
const Alert = require('../models/alert.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    messagecode: {type: Number, default: '4000'},
    Alert,
    token: {type: String, default: null},
    responsedate: {type: Date, default: Date.now}
});