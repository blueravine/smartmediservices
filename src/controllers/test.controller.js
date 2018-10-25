const Test = require('../models/test.model');
const response = require('../schemas/api.response.test');

exports.register = function (req, res, next) {
    var newTest = test_create(req);   
};

exports.test_create = function (req, res, next) {
    console.log('creating test ' + JSON.stringify(req.body));
req.body.forEach(element => {
    
        let test = new Test({
            countrycode: element.countrycode,
            testname: element.testname,
            normalmin:element.normalmin,
            normalmax:element.normalmax,
            normalcomparator:element.normalcomparator,
            categoryid: element.categoryid,
            category: element.category
        });

        test.save(function (err) {
            if (err) {
                console.log('error while creating test ' + err);
                return next(err);
            }
        });
    });
    console.log('tests  created');
    response.message = 'tests  registered';
    response.status=200;
    response.Test = null;
    response.token = null;
    res.status(response.status).send(response);
};

exports.tests_byname = function (req, res, next) {
    console.log('retrieving tests by name');

                Test.findOne({"testname": req.body.name, "countrycode": req.body.countrycode}, function (err, test) {
                    if (err) {
                        console.log('error while finding tests by name.');
                        return next(err);
                    }

                    if(test) {
                        console.log('found tests by name.');
                    response.status=200;
                    response.message = 'tests found';
                    response.Test = test;
                    response.token=null;
                    }
                    else {
                        console.log('tests not found by name.');
                        response.status=200;
                        response.message = 'tests not found';
                        response.Test = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};
