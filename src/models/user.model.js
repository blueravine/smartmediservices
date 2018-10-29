const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    id: {type: Number, required: false},
    mobile: {type: Number, required: false},
    countrycode: {type: Number, required: false},
    name: {type: String, required: false},
    username: {type: String, required: false},
    email: {type: String, required: false},
    age: {type: Number, required: false},
    gender:{type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);