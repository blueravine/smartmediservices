const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');

var feedbackSchema = new Schema({
    id: {type: String, required: false},
    mobile: {type: Number, required: false},
    countrycode: {type: Number, required: false},
    name: {type: String, required: false},
    feedback: {type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

var Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;