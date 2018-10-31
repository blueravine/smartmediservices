const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var alertSchema = new Schema({
    id: {type: Number, required: false},
    mobile: {type: Number, required: false},    
    countrycode: {type: Number, required: false},
    startdate: {type: Number, required: false},
    enddate: {type: Number, required: false},
    frequency: {type: String, required: false},
    repeat1: {type: String, required: false},
    repeat2: {type: String, required: false},
    repeat3: {type: String, required: false},
    repeat4: {type: String, required: false},
    weekday: {type: String, required: false},
    medicationdate:{type: Number, required: false},
    Notes:{type:String, required:false},
    createddate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Alert', alertSchema);