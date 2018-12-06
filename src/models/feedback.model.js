const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');
const moment = require('moment');

var feedbackSchema = new Schema({
    id: {type: Number, required: false, default: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100)},
    mobile: {type: Number, required: false},
    countrycode: {type: Number, required: false},
    name: {type: String, required: false},
    feedback: {type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

var Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;