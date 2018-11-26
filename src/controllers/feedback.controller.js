const Feedback = require('../models/feedback.model');
const response = require('../schemas/api.response.feedback');
const winston = require('../../utils/winston');

//Test
exports.test = function (req, res) {
    winston.info(`Hello there! - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    console.log(`Hello there! - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    response.status=200;
    response.message = 'Hello!';
    response.messagecode = 6001;
    response.Feedback=null;
    response.token=null;
    res.status(response.status).send(response);
};

exports.register = function (req, res, next) {
    var newFeedback = feedback_create(req);
    
};

exports.feedback_create = function (req, res, next) {
    winston.info(`creating feedback - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    let feedback = new Feedback({
        id: req.body.id,
        feedback: req.body.feedback,
        mobile: req.body.mobile,
        countrycode: req.body.countrycode,
        name: req.body.name,
    });

    feedback.save(function (err) {
        if (err) {
            winston.error(`${err.status || 500} - error while creating feedback - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        winston.info(`feedback created - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        response.message = 'feedback created';
        response.messagecode = 6002;
        response.status=200;
        response.Feedback = feedback;
        response.token = null;
        res.status(response.status).send(response);
    })

};
