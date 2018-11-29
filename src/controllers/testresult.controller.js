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

            let userageontest = (element.age ? element.age : user.age);
            
            Test.findOne({"testname": element.testname,
                            "testagemin": {$lte: userageontest},
                            "testagemax": {$gte: userageontest},
                            "testgender": user.gender,
                            "countrycode": element.countrycode
            }, function (err, testgendercountry) {
                if (err) {
                    winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    return next(err);
                }

                if(testgendercountry) {
                    winston.info(`found testgendercountry by name - ${test} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                    let testresult = new TestResult({
                        testdate: element.testdate,
                        ageontest: element.age? element.age : user.age,
                        testname: element.testname,
                        mobile: element.mobile,
                        countrycode: element.countrycode,
                        value: element.value,
                        testunit: testgendercountry.testunit,
                        normalmin:testgendercountry.normalmin,
                        normalmax:testgendercountry.normalmax,
                        normalcomparator:testgendercountry.normalcomparator,
                        result: ((element.value >= testgendercountry.normalmin) && (element.value <= testgendercountry.normalmax)) ? 'normal'
                                     : (element.value > testgendercountry.normalmax) ? 'high'
                                     : (element.value < testgendercountry.normalmin) ? 'low' : 'undetermined',
                        categoryid: testgendercountry.categoryid,
                        category: testgendercountry.category,
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

                            Test.findOne({"testname": element.testname,
                                            "testagemin": {$lte: userageontest},
                                            "testagemax": {$gte: userageontest},
                                            "testgender":"UNISEX",
                                            "countrycode": element.countrycode
                            }, function (err, testunicountry) {
                                if (err) {
                                    winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                    return next(err);
                                }

                                if(testunicountry) {
                                    winston.info(`found testunicountry by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                                    let testresult = new TestResult({
                                        testdate: element.testdate,
                                        ageontest: element.age? element.age : user.age,
                                        testname: element.testname,
                                        mobile: element.mobile,
                                        countrycode: element.countrycode,
                                        value: element.value,
                                        testunit: testunicountry.testunit,
                                        normalmin:testunicountry.normalmin,
                                        normalmax:testunicountry.normalmax,
                                        normalcomparator:testunicountry.normalcomparator,
                                        result: ((element.value >= testunicountry.normalmin) && (element.value <= testunicountry.normalmax)) ? 'normal'
                                                    : (element.value > testunicountry.normalmax) ? 'high'
                                                    : (element.value < testunicountry.normalmin) ? 'low' : 'undetermined',
                                        categoryid: testunicountry.categoryid,
                                        category: testunicountry.category,
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

                                                Test.findOne({"testname": element.testname,
                                                        "testagemin": {$lte: userageontest},
                                                        "testagemax": {$gte: userageontest},
                                                        "testgender": user.gender,
                                                        "countrycode": 0
                                        }, function (err, testgendergeneric) {
                                            if (err) {
                                                winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                                return next(err);
                                            }

                                            if(testgendergeneric) {
                                                winston.info(`found testgendergeneric by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);


                                                let testresult = new TestResult({
                                                    testdate: element.testdate,
                                                    ageontest: element.age? element.age : user.age,
                                                    testname: element.testname,
                                                    mobile: element.mobile,
                                                    countrycode: element.countrycode,
                                                    value: element.value,
                                                    testunit: testgendergeneric.testunit,
                                                    normalmin:testgendergeneric.normalmin,
                                                    normalmax:testgendergeneric.normalmax,
                                                    normalcomparator:testgendergeneric.normalcomparator,
                                                    result: ((element.value >= testgendergeneric.normalmin) && (element.value <= testgendergeneric.normalmax)) ? 'normal'
                                                                : (element.value > testgendergeneric.normalmax) ? 'high'
                                                                : (element.value < testgendergeneric.normalmin) ? 'low' : 'undetermined',
                                                    categoryid: testgendergeneric.categoryid,
                                                    category: testgendergeneric.category,
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

                                                Test.findOne({"testname": element.testname,
                                                "testagemin": {$lte: userageontest},
                                                "testagemax": {$gte: userageontest},
                                                "testgender":"UNISEX",
                                                "countrycode": 0
                                                }, function (err, testunigeneric) {
                                                    if (err) {
                                                        winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                    
                                                        return next(err);
                                                    }
                                    
                                                    if(test) {
                                                        winston.info(`found testunigeneric by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                    
                                    
                                                        let testresult = new TestResult({
                                                            testdate: element.testdate,
                                                            ageontest: element.age? element.age : user.age,
                                                            testname: element.testname,
                                                            mobile: element.mobile,
                                                            countrycode: element.countrycode,
                                                            value: element.value,
                                                            testunit: testunigeneric.testunit,
                                                            normalmin:testunigeneric.normalmin,
                                                            normalmax:testunigeneric.normalmax,
                                                            normalcomparator:testunigeneric.normalcomparator,
                                                            result: ((element.value >= testunigeneric.normalmin) && (element.value <= testunigeneric.normalmax)) ? 'normal'
                                                                        : (element.value > testunigeneric.normalmax) ? 'high'
                                                                        : (element.value < testunigeneric.normalmin) ? 'low' : 'undetermined',
                                                            categoryid: testunigeneric.categoryid,
                                                            category: testunigeneric.category,
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
                                    
                                                    }); // Test findOne gender and country

                                                
                                                trsuccessflag = false;
                                                winston.info(`test not found by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                                response.status=200;
                                                response.message = 'testname not found: ' + element.testname + '.';
                                                response.messagecode = 2002;
                                                response.TestResult = null;
                                                response.token=null;
                                                }
                                                winston.info(`creating test result - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                            }); // Test findOne gender and country


                                    
                                    trsuccessflag = false;
                                    winston.info(`test not found by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                    response.status=200;
                                    response.message = 'testname not found: ' + element.testname + '.';
                                    response.messagecode = 2002;
                                    response.TestResult = null;
                                    response.token=null;
                                    }
                                    winston.info(`creating test result - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                }); // Test findOne gender and country


                    trsuccessflag = false;
                    winston.info(`test not found by name - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'testname not found: ' + element.testname + '.';
                    response.messagecode = 2002;
                    response.TestResult = null;
                    response.token=null;
                    }
                    winston.info(`creating test result - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                }); // Test findOne gender and country
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

    User.findOne({"mobile": req.body.mobile, "countrycode": req.body.countrycode}, function(err, user) {
        if(err){
            winston.error(`${err.status || 500} - error while finding test - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        if(user){
            winston.info(`user found: ${user} age: ${user.age} gender: ${user.gender} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            let userageontest = (req.body.age ? req.body.age : user.age);
            var testfound;
            Test.findOne({"testname": req.body.testname,
                            "testagemin": {$lte: userageontest},
                            "testagemax": {$gte: userageontest},
                            "testgender": user.gender,
                            "countrycode": req.body.countrycode
            }, function (err, testgendercountry) {
                if (err) {
                    winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    return next(err);
                }

                if(testgendercountry) {
                    winston.info(`found testgendercountry by name - ${testgendercountry} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    testfound = testgendercountry;

                    TestResult.findOneAndUpdate({"mobile": req.body.mobile, "countrycode": req.body.countrycode,
                            "testdate": req.body.testdate, "testname": req.body.testname},
                          {$set: {value: req.body.value, ageontest: req.body.age, notes: req.body.notes,
                            normalmin:testfound.normalmin,
                            normalmax:testfound.normalmax,
                            normalcomparator:testfound.normalcomparator,
                            result: ((req.body.value >= testfound.normalmin) && (req.body.value <= testfound.normalmax)) ? 'normal'
                                         : (req.body.value > testfound.normalmax) ? 'high'
                                         : (req.body.value < testfound.normalmin) ? 'low' : 'undetermined'
                        }},
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



                } else {
                    Test.findOne({"testname": req.body.testname,
                            "testagemin": {$lte: userageontest},
                            "testagemax": {$gte: userageontest},
                            "testgender":"UNISEX",
                            "countrycode": req.body.countrycode
                            }, function (err, testunicountry) {
                                if (err) {
                                    winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                    return next(err);
                                }

                                if(testunicountry) {
                                    winston.info(`found testunicountry by name - ${testunicountry} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                    testfound = testunicountry;

                                    TestResult.findOneAndUpdate({"mobile": req.body.mobile, "countrycode": req.body.countrycode,
                                            "testdate": req.body.testdate, "testname": req.body.testname},
                                          {$set: {value: req.body.value, ageontest: req.body.age, notes: req.body.notes,
                                            normalmin:testfound.normalmin,
                                            normalmax:testfound.normalmax,
                                            normalcomparator:testfound.normalcomparator,
                                            result: ((req.body.value >= testfound.normalmin) && (req.body.value <= testfound.normalmax)) ? 'normal'
                                                         : (req.body.value > testfound.normalmax) ? 'high'
                                                         : (req.body.value < testfound.normalmin) ? 'low' : 'undetermined'
                                        }},
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
                

                                } 
                    else {
                        Test.findOne({"testname": req.body.testname,
                            "testagemin": {$lte: userageontest},
                            "testagemax": {$gte: userageontest},
                            "testgender": user.gender,
                            "countrycode": 0
                        }, function (err, testgendergeneric) {
                            if (err) {
                                winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                return next(err);
                            }

                            if(testgendergeneric) {
                                winston.info(`found testgendergeneric by name - ${testgendergeneric} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                                testfound = testgendergeneric;

                                TestResult.findOneAndUpdate({"mobile": req.body.mobile, "countrycode": req.body.countrycode,
                                        "testdate": req.body.testdate, "testname": req.body.testname},
                                      {$set: {value: req.body.value, ageontest: req.body.age, notes: req.body.notes,
                                        normalmin:testfound.normalmin,
                                        normalmax:testfound.normalmax,
                                        normalcomparator:testfound.normalcomparator,
                                        result: ((req.body.value >= testfound.normalmin) && (req.body.value <= testfound.normalmax)) ? 'normal'
                                                     : (req.body.value > testfound.normalmax) ? 'high'
                                                     : (req.body.value < testfound.normalmin) ? 'low' : 'undetermined'
                                    }},
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
            
                            } else {
                                    Test.findOne({"testname": req.body.testname,
                                    "testagemin": {$lte: userageontest},
                                    "testagemax": {$gte: userageontest},
                                    "testgender":"UNISEX",
                                    "countrycode": 0
                                        }, function (err, testunigeneric) {
                                            if (err) {
                                                winston.error(`${err.status || 500} - error while finding test by name - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                
                                                return next(err);
                                            }
                
                                            if(testunigeneric) {
                                                winston.info(`found testunigeneric by name - ${testunigeneric} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                
                                                testfound = testunigeneric;

                                                TestResult.findOneAndUpdate({"mobile": req.body.mobile, "countrycode": req.body.countrycode,
                                                        "testdate": req.body.testdate, "testname": req.body.testname},
                                                      {$set: {value: req.body.value, ageontest: req.body.age, notes: req.body.notes,
                                                        normalmin:testfound.normalmin,
                                                        normalmax:testfound.normalmax,
                                                        normalcomparator:testfound.normalcomparator,
                                                        result: ((req.body.value >= testfound.normalmin) && (req.body.value <= testfound.normalmax)) ? 'normal'
                                                                     : (req.body.value > testfound.normalmax) ? 'high'
                                                                     : (req.body.value < testfound.normalmin) ? 'low' : 'undetermined'
                                                    }},
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
                            
                                            }   
                                })//end of Test findOne for uni and generic
                            }
                        }) //end of Test findOne for gender and generic
                    }
                }) //end of Test findOne for uni and country
                }
            }) //end of Test findOne for gender and country

            }
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