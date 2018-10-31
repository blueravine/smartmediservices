const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var testSchema = new Schema({
    id: {type: Number, required: false},    
    countrycode: {type: String, required: false},
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
    createddate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Test', testSchema);