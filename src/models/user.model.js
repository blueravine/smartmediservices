const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    id: {type: Number, required: false},
    mobile: {type: Number, required: false},
    countrycode: {type: String, required: false},
    name: {type: String, required: false},
    username: {type: String, required: false},
    password_hash: {type: String, required: true},
    email: {type: String, required: false},
    age: {type: Number, required: false},
    gender:{type: String, required: false},
    createddate: {type: Date, default: Date.now}
});

userSchema.pre('save', function (next) {
    var self = this;
    User.find({mobile : self.mobile, countrycode: self.countrycode}, function (err, userdoc) {
        if (!userdoc.length){
            next();
        }else{                
            console.log('user exists: ',self.countrycode + '-' + self.mobile);
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
            console.log('username already exists: ', self.username);
            next(new Error("UserName Already exists!"));
        }
    });
}) ;

var User = mongoose.model('User', userSchema);
module.exports = User;