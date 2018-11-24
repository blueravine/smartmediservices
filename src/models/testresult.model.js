const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');

var testresultSchema = new Schema({
    id: {type: Number, required: false},
    mobile: {type: Number, required: false},
    countrycode: {type: Number, required: false},
    testdate: {type: Number, required: false},
    ageontest: {type: Number, required: false},
    testname: {type: String, required: false},
    value: {type: Number, required: false},
    testunit: {type: String, required: false},
    normalmin:{type: Number, required: false},
    normalmax:{type: Number, required: false},
    normalcomparator:{type: String, required: false},
    result: {type: String, required: false},
    notes: {type: String, required: false},
    categoryid: {type: Number, required: false},
    category: {type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

testresultSchema.pre('save', function (next) {
    var self = this;
    TestResult.find({mobile : self.mobile,
                     countrycode: self.countrycode,
                     testdate:self.testdate,
                     testname: self.testname}, function (err, testresultdoc) {
        if (!testresultdoc.length){
            next();
        }else{
            winston.info(`test result exists: ${self.countrycode} - ${self.mobile} - ${self.testdate} - ${self.testname}`);
            next(new Error("Test Result Already exists for: " + self.testname + ' on ' + self.testdate));
        }
    });
}) ;

var TestResult = mongoose.model('TestResult', testresultSchema);
module.exports = TestResult;