const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');
const response = require('./src/schemas/api.response.user');
const techerrorres = require('./src/schemas/api.response.techerror');
const smartjwt = require('./utils/jwt');
const winston = require('./utils/winston');

//Import routes for the user
const user = require('./src/routes/user.route');

//Import routes for the test result
const testresult = require('./src/routes/testresult.route');

//Import routes for the test
const test = require('./src/routes/test.route');

//Import routes for the alert
const alert = require('./src/routes/alert.route');

//Import routes for the feedback
const feedback = require('./src/routes/feedback.route');

//Import routes for the secret questions
const secretquestions = require('./src/routes/secretquestion.route');

//initial smartmedi services api
const app = express();

//set up MongoDB connection with mongoose
const mongoose = require('mongoose');


let db_url = 'mongodb://localhost:27017/smarmedi';
const mongoDB = process.env.MONGODB_URI || config.MONGODB_URI || db_url;

mongoose.connect(mongoDB, {useNewUrlParser: true} );
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind('MongoDB connection error'));

let signOptions = {
    issuer: "smartmediservices",
    subject: "",
    audience: ""
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logging middleware
var num = 0;
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var method = req.method;
    var url = req.url;

    winston.info(`${++num} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next();
});

smartjwt.getToken.unless = require('express-unless');
    
app.use(smartjwt.getToken.unless({
            path: [
                '/user/test',
                '/user/register',
                '/user/login',
                '/user/mobile',
                '/user/update/password',
                '/testresult/test',
                '/test/register',
                '/test/name',
                '/test',
                '/feedback/test',
                '/feedback/register',
                '/secretquestions/test',
                '/secretquestions/register',
                '/secretquestions/retrieve'
            ]
        }));

const verifyToken = function (req, res, next) {
        signOptions.subject=req.headers.countrycode + '-' + req.headers.mobile;
        signOptions.audience=req.headers.jwtaudience;

        if(smartjwt.verify(req.token, signOptions)){
            next();
        }
        else {
        response.status=403;
        response.message = 'Token not valid!';
        response.messagecode = 1009;
        response.User = req.headers.mobile;
        response.token = req.token;
    
        res.status(response.status).send(response);
        }
}

verifyToken.unless = require('express-unless');
app.use(verifyToken.unless({
        path: [
            '/user/test',
            '/user/register',
            '/user/login',
            '/user/mobile',
            '/user/update/password',
            '/testresult/test',
            '/test/register',
            '/test/name',
            '/test',
            '/feedback/test',
            '/feedback/register',
            '/secretquestions/test',
            '/secretquestions/register',
            '/secretquestions/retrieve'
        ]
    })
);

app.use('/user', user);

app.use('/testresult', testresult);
app.use('/test', test);
app.use('/alert', alert);
app.use('/feedback', feedback);
app.use('/secretquestions', secretquestions);

app.use(function (req, res, next) {
    winston.info(`'Cannot find RESTful resource!' - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    techerrorres.status=404;
    techerrorres.message = 'Cannot find RESTful resource!';
    techerrorres.messagecode = 5000;

    res.status(techerrorres.status).send(techerrorres);
  });

app.use(function (err, req, res, next) {
winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);

techerrorres.status=500;
    if(err.message.toLowerCase().includes('user already exists')){
        techerrorres.message = err.message;
        techerrorres.messagecode = 1010;
    }
    else if(err.message.toLowerCase().includes('username already exists')){
        techerrorres.message = err.message;
        techerrorres.messagecode = 1011;
    }
    else if(err.message.toLowerCase().includes('test result already exists')){
        techerrorres.message = err.message;
        techerrorres.messagecode = 2050;
    }
    else if(err.message.toLowerCase().includes('test already exists')){
        techerrorres.message = err.message;
        techerrorres.messagecode = 3050;
    }
    else {
        techerrorres.message = 'Internal Server Error! ' + err.message;
        techerrorres.messagecode = 5001;
    }

res.status(techerrorres.status).send(techerrorres);
});

const port = process.env.PORT || config.PORT || 3057;

app.listen(port, () => {
    winston.info(`Server is running on the port: ${port} `);
});