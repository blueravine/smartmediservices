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
            testunit: element.testunit,
            testagemin: element.testagemin,
            testagemax: element.testagemax,
            testgender: element.testgender,
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
    response.messagecode = 3001;
    response.status=200;
    response.Test = null;
    response.token = null;
    res.status(response.status).send(response);
};

exports.tests_byname = function (req, res, next) {
    console.log('retrieving tests by name' + JSON.stringify(req.body));

                Test.findOne({"testname": req.body.name,
                       "testagemin": {$lte: req.body.age},
                       "testagemax": {$gte: req.body.age},
                       $and:[{$or:[{"testgender": req.body.gender},{"testgender":"UNISEX"}]},
                       {$or: [{"countrycode": req.body.countrycode},{"countrycode": 0}]}]
                }, function (err, test) {
                    if (err) {
                        console.log('error while finding tests by name.');
                        return next(err);
                    }

                    if(test) {
                        console.log('found tests by name.');
                    response.status=200;
                    response.message = 'tests found';
                    response.messagecode = 3002;
                    response.Test = test;
                    response.token=null;
                    }
                    else {
                        console.log('tests not found by name.');
                        response.status=200;
                        response.message = 'tests not found';
                        response.messagecode = 3003;
                        response.Test = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};
