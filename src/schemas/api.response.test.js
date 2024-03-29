const Schema = require('schm');
const Test = require('../models/test.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    messagecode: {type: Number, default: '3000'},
    Test,
    token: {type: String, default: null},
    responsedate: {type: Date, default: Date.now}
});