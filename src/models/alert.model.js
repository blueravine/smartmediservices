const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var alertSchema = new Schema({
    id: {type: Number, required: false},
    mobile: {type: Number, required: false},    
    countrycode: {type: Number, required: false},
    startdate: {type: Number, required: false},
    enddate: {type: Number, required: false},
    medicinename: {type: String, required: false},
    medfrequency: {type: String, required: false},
    repeat1: {type: String, required: false},
    notificationid1:{type: String, required: false},
    repeat2: {type: String, required: false},
    notificationid2:{type: String, required: false},
    repeat3: {type: String, required: false},
    notificationid3:{type: String, required: false},
    repeat4: {type: String, required: false},
    notificationid4:{type: String, required: false},
    weekday: {type: String, required: false},
    meddate:{type: Number, required: false},
    notes:{type:String, required:false},
    createddate: {type: Date, default: Date.now}
});

alertSchema.pre('save', function (next) {
    var self = this;
    Alert.find({mobile: self.mobile, countrycode: self.countrycode, medicinename: self.medicinename},
         function (err, alertdoc) {
        if (!alertdoc.length){
            next();
        }else{                
            console.log('Alert exists: ',self.countrycode + '-' + self.mobile + '-' + self.medicinename);
            next(new Error("Alert Already exists for: " + self.countrycode + '-' + self.mobile + ' and ' + self.medicinename));
        }
    });
}) ;

var Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;