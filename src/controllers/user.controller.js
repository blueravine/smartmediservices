const User = require('../models/user.model');
const response = require('../schemas/api.response.user');
const bcrypt = require('bcrypt');
const smartjwt = require('../../utils/jwt');
const winston = require('../../utils/winston');

let signOptions = {
    issuer: "smartmediservices",
    subject: "",
    audience: ""
    
};

//Test
exports.test = function (req, res) {
    winston.info(`Hello there! - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    response.status=200;
    response.message = 'Hello!';
    response.messagecode = 1001;
    response.User=null;
    response.token=null;
    res.status(response.status).send(response);
};

exports.register = function (req, res, next) {
    var newUser = user_create(req);
    
};

exports.user_create = function (req, res, next) {
    winston.info(`creating user - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    let user = new User({
        name: req.body.name,
        mobile: req.body.mobile,
        countrycode: req.body.countrycode,
        email: req.body.email,
        password_hash: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username,
        age: req.body.age,
        gender: req.body.gender,
    });

    user.save(function (err) {
        if (err) {
            winston.error(`${err.status || 500} - error while creating user - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        winston.info(`user created - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        response.message = 'user created';
        response.messagecode = 1002;
        let {password_hash, ...withoutpwdhash} = user.toObject();
        response.status=200;
        response.User = withoutpwdhash;
        response.token = null;
        res.status(response.status).send(response);
    })

};

exports.user_update_password = function (req, res, next) {
    winston.info(`updating password for user - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        User.findOneAndUpdate({"mobile": req.body.mobile, "countrycode": req.body.countrycode},
        {$set: {"password_hash":bcrypt.hashSync(req.body.password, 10)}},
        {new: true},
        function (err, user) {
            if (err) {
                winston.error(`${err.status || 500} - error while updating password - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return next(err); 
            }
            if(user) {
                winston.info(`user updated: ${user} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                response.status=200;
                response.message = 'user updated';
                response.messagecode = 1009;
                response.User = user;
                response.token=null;
            }
            else {
                response.status=200;
                response.message = 'user not found';
                response.messagecode = 1005;
                response.User = null;
                response.token=null;
            }        

            res.status(response.status).send(response);
            }).select('-password_hash')
};

exports.user_authenticate = function (req, res, next) {
    winston.info(`authenticating user - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    User.findOne({"mobile": req.body.mobile, "countrycode": req.body.countrycode}, function (err, user) {
        if (err) {
            winston.error(`${err.status || 500} - error while authenticating user - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            return next(err);
        }

        if(user) {
            winston.info(`user found authenticating - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            if(bcrypt.compareSync(req.body.password, user.password_hash)){
                let {password_hash, ...withoutpwdhash} = user.toObject();
                signOptions.subject=req.body.countrycode + '-' + req.body.mobile;
                signOptions.audience=req.body.jwtaudience;
                let token = smartjwt.sign({mobile: req.body.mobile, countrycode: req.body.countrycode},signOptions);
                winston.info(`user authenticated - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                response.status=200;
                response.message = 'user authenticated';
                response.messagecode = 1003;
                response.User = withoutpwdhash;
                response.token = token;
            }
            else {
                winston.info(`password invalid - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                response.status=200;
                response.message = 'user authentication failed';
                response.messagecode = 1004;
                response.User = req.body.mobile;
                response.token = null;
            }

        }
        else {
            response.status=200;
            response.message = 'user not found';
            response.messagecode = 1005;
            response.User = req.body.mobile;
            response.token = null;
        }
        res.status(response.status).send(response);
    })
};

exports.user_verify_token = function (req, res, next) {

                winston.info(`user token is valid - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                response.status=200;
                response.message = 'jwt token valid';
                response.messagecode = 1006;
                response.User = req.headers.mobile;
                response.token = req.token;
        
        res.status(response.status).send(response);
    
};

exports.user_details = function (req, res, next) {
    winston.info(`retrieving user - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    User.findById(req.params.id, function (err, user) {
        if (err) {
            winston.error(`${err.status || 500} - error while retrieving user - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            return next(err);
        }
        
        if(user) {
            response.status=200;
            response.message = 'user found';
            response.messagecode = 1007;
            let {password_hash, ...withoutpwdhash} = user.toObject();
            response.User = withoutpwdhash;
            response.token=null;
            }
        else {
            response.status=200;
            response.message = 'user not found';
            response.messagecode = 1005;
            response.User = null;
            response.token=null;
        }
        res.status(response.status).send(response);
    }).select('-password_hash')
};

exports.user_details_bymobile = function (req, res, next) {
    winston.info(`retrieving user by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                User.findOne({"mobile": req.body.mobile, "countrycode": req.body.countrycode}, function (err, user) {
                    if (err) {
                        winston.error(`${err.status || 500} - error while finding user by mobile - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        return next(err);
                    }

                    if(user) {
                    winston.info(`found user by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    response.status=200;
                    response.message = 'user found';
                    response.messagecode = 1007;
                    response.User = user;
                    response.token=null;
                    }
                    else {
                        winston.info(`user not found by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        response.status=200;
                        response.message = 'user not found';
                        response.messagecode = 1005;
                        response.User = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                }).select('-password_hash')
};

exports.user_update_bymobile = function (req, res, next) {
    winston.info(`updating user by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    User.findOneAndUpdate({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode},
                          {$set: {"name":req.body.name,"age":req.body.age,"gender":req.body.gender,"email":req.body.email}},
                          {new: true},
                          function (err, user) {
        if (err) {
            winston.error(`${err.status || 500} - error while updating user - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            return next(err);
        }
        if(user) {
            winston.info(`user updated: ${user} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            response.status=200;
            response.message = 'user updated';
            response.messagecode = 1008;
            response.User = user;
            response.token=null;
            }
            else {
                response.status=200;
                response.message = 'user not found';
                response.messagecode = 1005;
                response.User = null;
                response.token=null;
            }        

            res.status(response.status).send(response);
    }).select('-password_hash')
};