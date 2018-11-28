const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');

var secretquestionSchema = new Schema({
    id: {type: String, required: false},
    questionid: {type: Number, required: false},
    question: {type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

var SecretQuestion = mongoose.model('SecretQuestion', secretquestionSchema);
module.exports = SecretQuestion;