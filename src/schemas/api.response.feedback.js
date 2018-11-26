const Schema = require('schm');
const Feedback = require('../models/feedback.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    messagecode: {type: Number, default: '1000'},
    Feedback,
    token: {type: String},
    createddate: {type: Date, default: Date.now}
});