const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');
const moment = require('moment');

var testSchema = new Schema({
    id: {type: Number, required: false, default: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100)},
    countrycode: {type: Number, required: false},
    testname: {type: String, required: false},
    testunit: {type: String, required: false},
    testagemin: {type: Number, required: false},
    testagemax: {type: Number, required: false},
    testgender: {type: String, required: false},
    normalmin:{type: Number, required: false},
    normalmax:{type: Number, required: false},
    normalcomparator:{type: String, required: false},
    categoryid: {type: Number, required: false},
    category: {type: String, required: false},
    notes: {type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

testSchema.pre('save', function (next) {
    var self = this;
    Test.find({countrycode: self.countrycode,
                     testname: self.testname,
                    testagemin: self.testagemin,
                testagemax: self.testagemax}, function (err, testdoc) {
        if (!testdoc.length){
            next();
        }else{
            winston.info(`test exists: ${self.countrycode} - ${self.testname}`);

            next(new Error('Test Already exists for: ' + self.countrycode + ' and ' + self.testname));
        }
    });
}) ;

var Test = mongoose.model('Test', testSchema);
module.exports = Test;