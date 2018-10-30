const Schema = require('schm');

var apiResponse = Schema({
    status: {type:String, default: 200},
    message: {type: String, default: 'success'},
    messagecode: {type: Number, default: '1000'},
    createddate: {type: Date, default: Date.now}
});