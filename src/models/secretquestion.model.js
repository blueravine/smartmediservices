const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');
const moment = require('moment');

var secretquestionSchema = new Schema({
    id: {type: Number, required: false, default: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100)},
    questionid: {type: Number, required: false},
    question: {type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

secretquestionSchema.pre('save', function (next) {
    var self = this;
    SecretQuestion.find({questionid: self.questionid},
            function (err, secretqdoc) {
            if (!secretqdoc.length){
                next();
            }else{
                winston.info(`Secret Question exists for question id: ${self.questionid}`);
                next(new Error(`Secret Question Already exists for id:  ${self.questionid}`));
            }
        });
}) ;

var SecretQuestion = mongoose.model('SecretQuestion', secretquestionSchema);
module.exports = SecretQuestion;