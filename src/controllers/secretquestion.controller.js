const SecretQuestion = require('../models/secretquestion.model');
const response = require('../schemas/api.response.secretquestion');
const winston = require('../../utils/winston');
const moment = require('moment');

//Test
exports.test = function (req, res) {
    winston.info(`Hello there! - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    response.status=200;
    response.message = 'Hello!';
    response.messagecode = 7001;
    response.SecretQuestion=null;
    response.token=null;
    res.status(response.status).send(response);
};

exports.register = function (req, res, next) {
    var newSecretQuestion = secretquestion_create(req);
    
};

exports.secretquestion_create = function (req, res, next) {
    winston.info(`creating secretquestion - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    let secretquestion = new SecretQuestion({
        id: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100),
        questionid: req.body.questionid,
        question: req.body.question
    });

    secretquestion.save(function (err) {
        if (err) {
            winston.error(`${err.status || 500} - error while creating secretquestion - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        winston.info(`secretquestion created - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        response.message = 'secretquestion created';
        response.messagecode = 7002;
        response.status=200;
        response.SecretQuestion = secretquestion;
        response.token = null;
        res.status(response.status).send(response);
    })

};

exports.secretquestion_retrieve = function (req, res, next) {
        winston.info(`retrieving all secret questions - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
        SecretQuestion.find({}, function (err, secretquestion) {
                        if (err) {
                            winston.error(`${err.status || 500} - error while finding all secret questions - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
                            return next(err);
                        }
    
                        if(secretquestion) {
                            winston.info(`found all secret questions - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
                        response.status=200;
                        response.message = 'secret questions found';
                        response.messagecode = 7006;
                        response.SecretQuestion = secretquestion;
                        response.token=null;
                        }
                        else {
                            winston.info(`secret questions not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
                            response.status=200;
                            response.message = 'secret questions not found';
                            response.messagecode = 7007;
                            response.SecretQuestion = null;
                            response.token=null;
                        }
                        res.status(response.status).send(response);
                    })
    };