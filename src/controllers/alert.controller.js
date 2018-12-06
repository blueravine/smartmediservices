const Alert = require('../models/alert.model');
const response = require('../schemas/api.response.alert');
const winston = require('../../utils/winston');
const async = require('async');
const moment = require('moment');

exports.register = function (req, res, next) {
    var newAlert = alert_create(req);   
};

exports.alert_create = function (req, res, next) {

    winston.info(`creating alert ${JSON.stringify(req.body)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    let savedalert = [];

    async.each(req.body, function (element, callback) {
    
        let alert = new Alert({
            id: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100),
            mobile: element.mobile,
            countrycode: element.countrycode,
            startdate: element.startdate,
            enddate: element.enddate,
            medicinename: element.medicinename,
            medfrequency: element.medfrequency,
            repeat1: element.repeat1,
            notificationid1: element.notificationid1,
            repeat2: element.repeat2,
            notificationid2: element.notificationid2,
            repeat3:element.repeat3,
            notificationid3: element.notificationid3,
            repeat4:element.repeat4,
            notificationid4: element.notificationid4,
            weekday:element.weekday,
            meddate: element.meddate,
            notes: element.notes
        });
        winston.info(`creating alert - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      
        alert.save(function (err) {
            if (err) {
                winston.error(`${err.status || 500} - error while creating alert - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                return next(err);
            }

            savedalert.push(alert);
            callback();
        });
      
      }, function (error) {
                if(error){
                    return next(error);
                }
                else{
                    winston.info(`alerts  created - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.message = 'alerts  registered';
                    response.messagecode = 4001;
                    response.status=200;
                    response.Alert = savedalert;
                    response.token = null;
                    return res.status(response.status).send(response);
                }
      });


};



exports.alerts_bymobile = function (req, res, next) {
    winston.info(`retrieving alerts by mobile: ${req.headers.mobile} countrycode: ${req.headers.countrycode} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                Alert.find({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode}, function (err, alert) {
                    if (err) {
                        winston.error(`${err.status || 500} - error while retrieving alerts - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        return next(err);
                    }

                    if(alert) {
                        winston.info(`found alerts by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'alerts found';
                    response.messagecode = 4002;
                    response.Alert = alert;
                    response.token=null;
                    }
                    else {
                        winston.info(`alerts not found by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);

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
    winston.info(`updating alert by mobile. countrycode: ${req.headers.countrycode} mobile: ${req.headers.mobile} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Alert.findOneAndUpdate({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode,
    "startdate":req.body.startdate, "enddate":req.body.enddate, "medicinename":req.body.medicinename, "medfrequency":req.body.medfrequency},
                    {$set: req.body},
                    {new: true},
         function (err, alert) {
                if (err) {
                    winston.error(`${err.status || 500} - error while updating alerts - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

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

exports.alert_retrieve_byid = function (req, res, next) {
    winston.info(`retrieving alert by alert id. ${req.body.medicinealertid} for countrycode: ${req.headers.countrycode} mobile: ${req.headers.mobile} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Alert.findOne({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode, id: req.body.medicinealertid},
         function (err, alert) {
                if (err) {
                    winston.error(`${err.status || 500} - error while retrieving alerts - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    return next(err);
                }
                if(alert) {
                    response.status=200;
                    response.message = 'alerts found';
                    response.messagecode = 4002;
                    response.Alert = alert;
                    response.token=null;
                    }
                    else {
                        response.status=200;
                        response.message = 'alerts not found for mobile:'+ req.headers.mobile + ' and country code: ' + req.headers.countrycode;
                        response.messagecode = 4003;
                        response.Alert = null;
                        response.token=null;
                    }        

                    res.status(response.status).send(response);
        })
};

exports.alert_update_byid = function (req, res, next) {
    winston.info(`updating alert by alert id. ${req.body.medicinealertid} for countrycode: ${req.headers.countrycode} mobile: ${req.headers.mobile} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Alert.findOneAndUpdate({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode, id: req.body.medicinealertid},
                    {$set: req.body},
                    {new: true},
         function (err, alert) {
                if (err) {
                    winston.error(`${err.status || 500} - error while updating alerts - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

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
    winston.info(`deleting alert by mobile. countrycode: ${req.headers.countrycode} mobile: ${req.headers.mobile} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Alert.findOneAndDelete({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode,
"startdate":req.body.startdate, "enddate":req.body.enddate, "medicinename":req.body.medicinename, "medfrequency":req.body.medfrequency},
         function (err, alert) {
                if (err) {
                    winston.error(`${err.status || 500} - error while deleting alerts - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

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

exports.alert_delete_byid = function (req, res, next) {
    winston.info(`deleting alert by alert id: ${req.body.medicinealertid} for countrycode: ${req.headers.countrycode} mobile: ${req.headers.mobile} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Alert.findOneAndDelete({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode, id: req.body.medicinealertid},
         function (err, alert) {
                if (err) {
                    winston.error(`${err.status || 500} - error while deleting alerts - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

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