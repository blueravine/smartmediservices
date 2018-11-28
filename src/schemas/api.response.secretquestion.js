const Schema = require('schm');
const SecretQuestion = require('../models/secretquestion.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    messagecode: {type: Number, default: '1000'},
    SecretQuestion,
    token: {type: String},
    createddate: {type: Date, default: Date.now}
});