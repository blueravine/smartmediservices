const Alert = require('../models/alert.model');
const response = require('../schemas/api.response.alert');

exports.register = function (req, res, next) {
    var newAlert = alert_create(req);   
};

exports.alert_create = function (req, res, next) {
let successflag = true;

    console.log('creating alert ' + JSON.stringify(req.body));
req.body.forEach(element => {
    
        let alert = new Alert({
            mobile: element.mobile,
            countrycode: element.countrycode,
            startdate: element.startdate,
            enddate: element.enddate,
            medicinename: element.medicinename,
            medfrequency: element.medfrequency,
            repeat1: element.repeat1,
            repeat2: element.repeat2,
            repeat3:element.repeat3,
            repeat4:element.repeat4,
            weekday:element.weekday,
            meddate: element.meddate,
            notificationid: element.notificationid,
            notes: element.notes
        });

        alert.save(function (err) {
            if (err) {
                successflag = false;
                console.log('error while creating alert ' + err);
                return next(err);
            }
        });
    });

    if(successflag){
    console.log('alerts  created');
    response.message = 'alerts  registered';
    response.messagecode = 4001;
    response.status=200;
    response.Alert = null;
    response.token = null;
    res.status(response.status).send(response);
    }
};

exports.alerts_bymobile = function (req, res, next) {
    console.log('retrieving alerts by mobile ' + req.headers.mobile + ' countrycode: ' + req.headers.countrycode);

                Alert.find({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode}, function (err, alert) {
                    if (err) {
                        console.log('error while finding alerts by mobile.');
                        return next(err);
                    }

                    if(alert) {
                        console.log('found alerts by mobile.');
                    response.status=200;
                    response.message = 'alerts found';
                    response.messagecode = 4002;
                    response.Alert = alert;
                    response.token=null;
                    }
                    else {
                        console.log('alerts not found by mobile.');
                        response.status=200;
                        response.message = 'alerts not found for mobile:'+ req.headers.mobile + ' and country code: ' + req.headers.countrycode;
                        response.messagecode = 4003;
                        response.Alert = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};

exports.alert_update_bymobile = function (req, res, next) {
    console.log('updating alert by mobile. countrycode: ' + req.headers.countrycode + ' mobile: ' + req.headers.mobile);
    
    Alert.findOneAndUpdate({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode,
    "startdate":req.body.startdate, "enddate":req.body.enddate, "medicinename":req.body.medicinename, "medfrequency":req.body.medfrequency},
                    {$set: req.body},
                    {new: true},
         function (err, alert) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                if(alert) {
                    response.status=200;
                    response.message = 'alert updated';
                    response.messagecode = 4004;
                    response.Alert = alert;
                    response.token=null;
                    }
                    else {
                        response.status=200;
                        response.message = 'alert not found';
                        response.messagecode = 4005;
                        response.Alert = null;
                        response.token=null;
                    }        

                    res.status(response.status).send(response);
        })
};

exports.alert_delete_bymobile = function (req, res, next) {
    console.log('deleting alert by mobile. countrycode: ' + req.headers.countrycode + ' mobile: ' + req.headers.mobile);
    
    Alert.findOneAndDelete({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode,
"startdate":req.body.startdate, "enddate":req.body.enddate, "medicinename":req.body.medicinename, "medfrequency":req.body.medfrequency},
         function (err, alert) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                if(alert) {
                    response.status=200;
                    response.message = 'alert deleted';
                    response.messagecode = 4006;
                    response.Alert = alert;
                    response.token=null;
                    }
                    else {
                        response.status=200;
                        response.message = 'alert not found';
                        response.messagecode = 4007;
                        response.Alert = null;
                        response.token=null;
                    }        

                    res.status(response.status).send(response);
        })
};