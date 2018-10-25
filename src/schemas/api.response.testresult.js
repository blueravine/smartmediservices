const Schema = require('schm');
const TestResult = require('../models/testresult.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    TestResult,
    token: {type: String, default: null},
    responsedate: {type: Date, default: Date.now}
});