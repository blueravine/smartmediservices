const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winston = require('../../utils/winston');
const moment = require('moment');

var userSchema = new Schema({
    id: {type: Number, required: false, default: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100)},
    mobile: {type: Number, required: false},
    countrycode: {type: Number, required: false},
    name: {type: String, required: false},
    username: {type: String, required: false},
    password_hash: {type: String, required: true},
    email: {type: String, required: false},
    age: {type: Number, required: false},
    gender:{type: String, required: false},
    secretquestionid:{type: Number, required: false},
    secretanswerhash: {type: String, required: true},
    role: {type: String, default: 'consumer', enum:['consumer','labtech','doctor']},
    organization: {type: String, default: 'none'},
    createddate: {type: Date, default: Date.now}
});

userSchema.pre('save', function (next) {
    var self = this;
    User.find({mobile : self.mobile, countrycode: self.countrycode}, function (err, userdoc) {
        if (!userdoc.length){
            next();
        }else{
            winston.info(`user exists: ${self.countrycode} - ${self.mobile}`);
            next(new Error("User Already exists!"));
        }
    });
}) ;

userSchema.pre('save', function (next) {
    var self = this;
    User.find({username: self.username}, function (err, userdoc) {
        if (!userdoc.length){
            next();
        }else{                
            winston.info(`username already exists: ${self.username}`);
            next(new Error("UserName Already exists!"));
        }
    });
}) ;

var User = mongoose.model('User', userSchema);
module.exports = User;