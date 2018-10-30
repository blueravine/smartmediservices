const Test = require('../models/test.model');
const TestResult = require('../models/testresult.model');
const response = require('../schemas/api.response.testresult');

exports.test = function (req, res) {
    console.log('Hello there!');
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
    console.log('finding test' + JSON.stringify(req.body.normal));
req.body.forEach((element) => {
    Test.findOne({"testname": element.name,
    "testagemin": {$lte: element.age},
    "testagemax": {$gte: element.age},
    $and:[{$or:[{"testgender": element.gender},{"testgender":"UNISEX"}]},
    {$or: [{"countrycode": element.countrycode},{"countrycode": 0}]}]
}, function (err, test) {
        if (err) {
            console.log('error while finding test by name.');
            return next(err);
        }

        if(test) {
            console.log('found test by name.');

            let testresult = new TestResult({
                testdate: element.testdate,
                ageontest: element.ageontest,
                testname: element.testname,
                mobile: element.mobile,
                countrycode: element.countrycode,
                value: element.value,
                testunit: testunit.testunit,
                normalmin:test.normalmin,
                normalmax:test.normalmax,
                normalcomparator:test.normalcomparator,
                result: element.result,
                categoryid: element.categoryid,
                category: element.category
            });
    
            testresult.save(function (err) {
                if (err) {
                    console.log('error while creating test result' + err);
                    return next(err);
                }
            })
    
        }
        else {
            console.log('test not found by name.');
            response.status=200;
            response.message = 'testname not found: ' + element.testname + '.';
            response.messagecode = 2002;
            response.TestResult = null;
            response.token=null;
            }
            console.log('creating test result' + JSON.stringify(test) + "-" + JSON.stringify(element));
        });
    });
    console.log('test results created');
    response.message = 'test results registered';
    response.messagecode = 2003;
    response.status=200;
    response.TestResult = null;
    response.token = null;
    res.status(response.status).send(response);
};

exports.testresults_bymobile = function (req, res, next) {
    console.log('retrieving test results by mobile');

                TestResult.find({"mobile": req.body.mobile, "countrycode": req.body.countrycode}, function (err, testresult) {
                    if (err) {
                        console.log('error while finding test results by mobile.');
                        return next(err);
                    }

                    if(testresult) {
                        console.log('found test results by mobile.');
                    response.status=200;
                    response.message = 'test results found';
                    response.messagecode = 2004;
                    response.TestResult = testresult;
                    response.token=null;
                    }
                    else {
                        console.log('test results not found by mobile.');
                        response.status=200;
                        response.message = 'test results not found';
                        response.messagecode = 2005;
                        response.TestResult = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};
