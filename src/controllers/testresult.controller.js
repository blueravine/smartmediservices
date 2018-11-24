const User = require('../models/user.model');
const Test = require('../models/test.model');
const TestResult = require('../models/testresult.model');
const response = require('../schemas/api.response.testresult');
const globalparams = require('../../globalparams.json');
const winston = require('../../utils/winston');

exports.test = function (req, res) {
    winston.info(`Hello there!' - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    response.status=200;
    response.message = 'Hello!';
    response.messagecode = 2001;
    response.TestResult=null;
    response.token=null;
    res.status(response.status).send(response);
};

exports.register = function (req, res, next) {
    var newTestResult = testresult_create(req);
    
};

exports.testresult_create = function (req, res, next) {
let trsuccessflag = true;

    winston.info(`finding test ${JSON.stringify(req.body.normal)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

req.body.forEach((element) => {
    User.findOne({"mobile": element.mobile, "countrycode": element.countrycode}, function(err, user) {
        if(err){
            winston.error(`${err.status || 500} - error while finding test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        if(user){
            winston.info(`user found: ${user} age: ${user.age} gender: ${user.gender} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            Test.findOne({"testname": element.testname,
                            "testagemin": {$lte: user.age},
                            "testagemax": {$gte: user.age},
                            $and:[{$or:[{"testgender": user.gender},{"testgender":"UNISEX"}]},
                            {$or: [{"countrycode": element.countrycode},{"countrycode": 0}]}]
            }, function (err, test) {
                if (err) {
                    winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    return next(err);
                }

                if(test) {
                    winston.info(`found test by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                    let testresult = new TestResult({
                        testdate: element.testdate,
                        ageontest: element.age? element.age : user.age,
                        testname: element.testname,
                        mobile: element.mobile,
                        countrycode: element.countrycode,
                        value: element.value,
                        testunit: test.testunit,
                        normalmin:test.normalmin,
                        normalmax:test.normalmax,
                        normalcomparator:test.normalcomparator,
                        result: ((element.value >= test.normalmin) && (element.value <= test.normalmax)) ? 'normal'
                                     : (element.value > test.normalmax) ? 'high'
                                     : (element.value < test.normalmin) ? 'low' : 'undetermined',
                        categoryid: test.categoryid,
                        category: test.category,
                        notes: element.notes
                    });
            
                    testresult.save(function (err) {
                        if (err) {
                            trsuccessflag = false;
                            winston.error(`${err.status || 500} - error while creating test result - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                            return next(err);
                        }
                    })
            
                }
                else {
                    trsuccessflag = false;
                    winston.info(`test not found by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'testname not found: ' + element.testname + '.';
                    response.messagecode = 2002;
                    response.TestResult = null;
                    response.token=null;
                    }
                    winston.info(`creating test result - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                });
      }
      else {
        trsuccessflag = false;
        winston.info(`user not found by mobile number - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        response.status=200;
        response.message = 'user not found: ' + element.countrycode + '-' + element.mobile;
        response.messagecode = 2008;
        response.TestResult = null;
        response.token=null;
        }
      });
    });

    if(trsuccessflag){
    winston.info(`test results created - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    response.message = 'test results registered';
    response.messagecode = 2003;
    response.status=200;
    response.TestResult = null;
    response.token = null;
    res.status(response.status).send(response);
    }
};

exports.testresults_bymobile = function (req, res, next) {
    winston.info(`retrieving test results by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                TestResult.find({"mobile": req.headers.mobile, "countrycode": req.headers.countrycode}, function (err, testresult) {
                    if (err) {
                        winston.error(`${err.status || 500} - error while finding test results by mobile - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        return next(err);
                    }

                    if(testresult) {
                        winston.info(`found test results by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'test results found';
                    response.messagecode = 2004;
                    response.TestResult = testresult;
                    response.token=null;
                    }
                    else {
                        winston.info(`test results not found by mobile - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        response.status=200;
                        response.message = 'test results not found';
                        response.messagecode = 2005;
                        response.TestResult = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                });
};

exports.testresults_update_bymobile = function (req, res, next) {
    winston.info(`updating test results by mobile: ${req.body.mobile} countrycode: ${req.body.countrycode} testdate: ${req.body.testdate} testname: ${req.body.testname} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    TestResult.findOneAndUpdate({"mobile": req.body.mobile, "countrycode": req.body.countrycode,
                            "testdate": req.body.testdate, "testname": req.body.testname},
                          {$set: {value: req.body.value, ageontest: req.body.age, notes: req.body.notes}},
                          {new: true},
                           function (err, testresult) {
        if (err) {
            winston.error(`${err.status || 500} - error while updating test results - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            return next(err);
        }
        if(testresult) {
            response.status=200;
            response.message = 'test result updated';
            response.messagecode = 2006;
            response.TestResult = testresult;
            response.token=null;
            }
            else {
                response.status=200;
                response.message = 'test result not found';
                response.messagecode = 2007;
                response.TestResult = null;
                response.token=null;
            }        

            res.status(response.status).send(response);
    })
};

exports.testresults_delete_bymobile = function (req, res, next) {
    winston.info(`deleting test results by mobile: ${req.body.mobile} countrycode: ${req.body.countrycode} testdate: ${req.body.testdate} testname: ${req.body.testname} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    
    TestResult.findOneAndDelete({"mobile": req.body.mobile, "countrycode": req.body.countrycode,
                            "testdate": req.body.testdate, "testname": req.body.testname},
                           function (err, testresult) {
        if (err) {
            winston.error(`${err.status || 500} - error while deleting test results - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        if(testresult) {
            response.status=200;
            response.message = 'test result deleted';
            response.messagecode = 2007;
            response.TestResult = testresult;
            response.token=null;
            }
            else {
                response.status=200;
                response.message = 'test result not found';
                response.messagecode = 2008;
                response.TestResult = null;
                response.token=null;
            }        

            res.status(response.status).send(response);
    })
};