const Schema = require('schm');
const User = require('../models/user.model');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    User,
    token: {type: String},
    createddate: {type: Date, default: Date.now}
});