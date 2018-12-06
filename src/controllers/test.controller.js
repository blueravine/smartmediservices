const Test = require('../models/test.model');
const response = require('../schemas/api.response.test');
const winston = require('../../utils/winston');
const async = require('async');
const moment = require('moment');

exports.register = function (req, res, next) {
    var newTest = test_create(req);   
};

exports.test_create = function (req, res, next) {

    winston.info(`creating test ${JSON.stringify(req.body)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    async.each(req.body, function (element, callback) {
    
        let test = new Test({
            id: parseInt(moment().format('YYYYMMDDhhmmssSSS'))+Math.floor(Math.random() * 100),
            countrycode: element.countrycode,
            testname: element.testname,
            testunit: element.testunit,
            testagemin: element.testagemin,
            testagemax: element.testagemax,
            testgender: element.testgender,
            normalmin:element.normalmin,
            normalmax:element.normalmax,
            normalcomparator:element.normalcomparator,
            categoryid: element.categoryid,
            category: element.category,
            notes: element.notes
        });
        winston.info(`creating test - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        test.save(function (err) {
            if (err) {
                winston.error(`${err.status || 500} - error while creating test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                return next(err);
            }
            callback();
        });
            }, function (error) {
                    if(error){
                        return next(error);
                    }
                    else{
                        winston.info(`tests  created - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        response.message = 'tests  registered';
                        response.messagecode = 3001;
                        response.status=200;
                        response.Test = null;
                        response.token = null;
                        res.status(response.status).send(response);
                    }

    });
};

exports.tests_byname = function (req, res, next) {
    winston.info(`retrieving tests by name ${JSON.stringify(req.body)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                Test.findOne({"testname": req.body.name,
                       "testagemin": {$lte: req.body.age},
                       "testagemax": {$gte: req.body.age},
                       $and:[{$or:[{"testgender": req.body.gender},{"testgender":"UNISEX"}]},
                       {$or: [{"countrycode": req.body.countrycode},{"countrycode": 0}]}]
                }, function (err, test) {
                    if (err) {
                        winston.error(`${err.status || 500} - error while finding tests by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        return next(err);
                    }

                    if(test) {
                        winston.info(`found tests by name' - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'tests found';
                    response.messagecode = 3002;
                    response.Test = test;
                    response.token=null;
                    }
                    else {
                        winston.info(`tests not found by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        response.status=200;
                        response.message = 'tests not found';
                        response.messagecode = 3003;
                        response.Test = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};

exports.tests_all = function (req, res, next) {
    winston.info(`retrieving all tests ${JSON.stringify(req.body)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                Test.find({
                       "testagemin": {$lte: req.body.age},
                       "testagemax": {$gte: req.body.age},
                       $and:[{$or:[{"testgender": req.body.gender},{"testgender":"UNISEX"}]},
                       {$or: [{"countrycode": req.body.countrycode},{"countrycode": 0}]}]
                }, function (err, test) {
                    if (err) {
                        winston.error(`${err.status || 500} - error while finding all tests - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        return next(err);
                    }

                    if(test) {
                        winston.info(`found all tests - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'tests found';
                    response.messagecode = 3006;
                    response.Test = test;
                    response.token=null;
                    }
                    else {
                        winston.info(`tests not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        response.status=200;
                        response.message = 'tests not found';
                        response.messagecode = 3007;
                        response.Test = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};

exports.test_update_byname = function (req, res, next) {
    winston.info(`updating test by name. countrycode: ${req.body.countrycode} testname: ${req.body.testname} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Test.findOneAndUpdate({"testname": req.body.name,
                            "testagemin": {$lte: req.body.age},
                            "testagemax": {$gte: req.body.age},
                            "testgender": req.body.gender,
                            "countrycode": req.body.countrycode
                          },
                          {$set: req.body},
                          {new: true},
        function (err, testgendercountry) {
                if (err) {
                    winston.error(`${err.status || 500} - error while updating test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    return next(err);
                }
                if(testgendercountry) {
                    response.status=200;
                    response.message = 'test updated';
                    response.messagecode = 3004;
                    response.Test = testgendercountry;
                    response.token=null;
                    }
                    else {

                        Test.findOneAndUpdate({"testname": req.body.name,
                                            "testagemin": {$lte: req.body.age},
                                            "testagemax": {$gte: req.body.age},
                                            "testgender":"UNISEX",
                                            "countrycode": req.body.countrycode
                                            },
                                            {$set: req.body},
                                            {new: true},
                            function (err, testunicountry) {
                                    if (err) {
                                        winston.error(`${err.status || 500} - error while updating test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                        return next(err);
                                    }
                                    if(testunicountry) {
                                        response.status=200;
                                        response.message = 'test updated';
                                        response.messagecode = 3004;
                                        response.Test = testunicountry;
                                        response.token=null;
                                        }
                                        else {

                                            Test.findOneAndUpdate({"testname": req.body.name,
                                                                "testagemin": {$lte: req.body.age},
                                                                "testagemax": {$gte: req.body.age},
                                                                "testgender": req.body.gender,
                                                                "countrycode": 0
                                                            },
                                                            {$set: req.body},
                                                            {new: true},
                                            function (err, testgendergeneric) {
                                                    if (err) {
                                                        winston.error(`${err.status || 500} - error while updating test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                    
                                                        return next(err);
                                                    }
                                                    if(test) {
                                                        response.status=200;
                                                        response.message = 'test updated';
                                                        response.messagecode = 3004;
                                                        response.Test = testgendergeneric;
                                                        response.token=null;
                                                        }
                                                        else {
                                    
                                                            Test.findOneAndUpdate({"testname": req.body.name,
                                                                                "testagemin": {$lte: req.body.age},
                                                                                "testagemax": {$gte: req.body.age},
                                                                                "testgender":"UNISEX",
                                                                                "countrycode": 0
                                                                            },
                                                                            {$set: req.body},
                                                                            {new: true},
                                                            function (err, testunigeneric) {
                                                                    if (err) {
                                                                        winston.error(`${err.status || 500} - error while updating test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                                    
                                                                        return next(err);
                                                                    }
                                                                    if(testunigeneric) {
                                                                        response.status=200;
                                                                        response.message = 'test updated';
                                                                        response.messagecode = 3004;
                                                                        response.Test = testunigeneric;
                                                                        response.token=null;
                                                                        }
                                                                        else {
                                                    
                                                    
                                                    
                                                                            response.status=200;
                                                                            response.message = 'test not found';
                                                                            response.messagecode = 3005;
                                                                            response.Test = null;
                                                                            response.token=null;
                                                                        }        
                                                    
                                                                        res.status(response.status).send(response);
                                                            })
                                    
                                                            response.status=200;
                                                            response.message = 'test not found';
                                                            response.messagecode = 3005;
                                                            response.Test = null;
                                                            response.token=null;
                                                        }        
                                    
                                                        res.status(response.status).send(response);
                                            })

                                            response.status=200;
                                            response.message = 'test not found';
                                            response.messagecode = 3005;
                                            response.Test = null;
                                            response.token=null;
                                        }        

                                        res.status(response.status).send(response);
                            })

                        response.status=200;
                        response.message = 'test not found';
                        response.messagecode = 3005;
                        response.Test = null;
                        response.token=null;
                    }        

                    res.status(response.status).send(response);
        })
};

exports.test_delete_byname = function (req, res, next) {
    winston.info(`deleting test by name. countrycode: ${req.body.countrycode} testname: ${req.body.testname} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    Test.findOneAndDelete({"testname": req.body.name,
                            "testagemin": {$lte: req.body.age},
                            "testagemax": {$gte: req.body.age},
                            "testgender": req.body.gender,
                            "countrycode": req.body.countrycode
                          },
        function (err, testgendercountry) {
                if (err) {
                    winston.error(`${err.status || 500} - error while deleting test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    return next(err);
                }
                if(testgendercountry) {
                    response.status=200;
                    response.message = 'test deleted';
                    response.messagecode = 3005;
                    response.Test = testgendercountry;
                    response.token=null;
                    }
                    else {

                        Test.findOneAndDelete({"testname": req.body.name,
                                                "testagemin": {$lte: req.body.age},
                                                "testagemax": {$gte: req.body.age},
                                                "testgender":"UNISEX",
                                                "countrycode": req.body.countrycode
                                            },
                            function (err, testunicountry) {
                                    if (err) {
                                        winston.error(`${err.status || 500} - error while deleting test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                        return next(err);
                                    }
                                    if(testunicountry) {
                                        response.status=200;
                                        response.message = 'test deleted';
                                        response.messagecode = 3005;
                                        response.Test = testunicountry;
                                        response.token=null;
                                        }
                                        else {

                                            Test.findOneAndDelete({"testname": req.body.name,
                                                                    "testagemin": {$lte: req.body.age},
                                                                    "testagemax": {$gte: req.body.age},
                                                                    "testgender": req.body.gender,
                                                                    "countrycode": 0
                                                                },
                                                function (err, testgendergeneric) {
                                                        if (err) {
                                                            winston.error(`${err.status || 500} - error while deleting test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                        
                                                            return next(err);
                                                        }
                                                        if(testgendergeneric) {
                                                            response.status=200;
                                                            response.message = 'test deleted';
                                                            response.messagecode = 3005;
                                                            response.Test = testgendergeneric;
                                                            response.token=null;
                                                            }
                                                            else {
                                        
                                                                Test.findOneAndDelete({"testname": req.body.name,
                                                                                        "testagemin": {$lte: req.body.age},
                                                                                        "testagemax": {$gte: req.body.age},
                                                                                        "testgender":"UNISEX",
                                                                                        "countrycode": 0
                                                                                    },
                                                                    function (err, testunigeneric) {
                                                                            if (err) {
                                                                                winston.error(`${err.status || 500} - error while deleting test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                                            
                                                                                return next(err);
                                                                            }
                                                                            if(testunigeneric) {
                                                                                response.status=200;
                                                                                response.message = 'test deleted';
                                                                                response.messagecode = 3005;
                                                                                response.Test = testunigeneric;
                                                                                response.token=null;
                                                                                }
                                                                                else {
                                                            
                                                                                    
                                                                                    response.status=200;
                                                                                    response.message = 'test not found';
                                                                                    response.messagecode = 3006;
                                                                                    response.Test = null;
                                                                                    response.token=null;
                                                                                }        
                                                            
                                                                                res.status(response.status).send(response);
                                                                    })
                                                                
                                                                response.status=200;
                                                                response.message = 'test not found';
                                                                response.messagecode = 3006;
                                                                response.Test = null;
                                                                response.token=null;
                                                            }        
                                        
                                                            res.status(response.status).send(response);
                                                })
                                            response.status=200;
                                            response.message = 'test not found';
                                            response.messagecode = 3006;
                                            response.Test = null;
                                            response.token=null;
                                        }        

                                        res.status(response.status).send(response);
                            })

                        response.status=200;
                        response.message = 'test not found';
                        response.messagecode = 3006;
                        response.Test = null;
                        response.token=null;
                    }        

                    res.status(response.status).send(response);
        })
};