const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');
const response = require('./src/schemas/api.response.user');
const techerrorres = require('./src/schemas/api.response.techerror');
const smartjwt = require('./utils/jwt');

//Import routes for the user
const user = require('./src/routes/user.route');

//Import routes for the test result
const testresult = require('./src/routes/testresult.route');

//Import routes for the test
const test = require('./src/routes/test.route');

//Import routes for the alert
const alert = require('./src/routes/alert.route');

//initial smartmedi services api
const app = express();

//set up MongoDB connection with mongoose
const mongoose = require('mongoose');

let db_url = 'mongodb://localhost:27017/smarmedi';
const mongoDB = process.env.MONGODB_URI || config.MONGODB_URI || db_url;

mongoose.connect(mongoDB, {useNewUrlParser: true} );
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

    console.log((++num) + ". IP " + ip + " " + method + " " + url);
    next();
});

smartjwt.getToken.unless = require('express-unless');
    
app.use(smartjwt.getToken.unless({
            path: [
                '/user/test',
                '/user/register',
                '/user/login',
                '/user/mobile',
                '/testresult/test',
                '/test/register',
                '/test/name',
                '/test'
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
            '/testresult/test',
            '/test/register',
            '/test/name',
            '/test'
        ]
    })
);

app.use('/user', user);

app.use('/testresult', testresult);
app.use('/test', test);
app.use('/alert', alert);

app.use(function (req, res, next) {
    console.log("Cannot find RESTful resource!");

    techerrorres.status=404;
    techerrorres.message = 'Cannot find RESTful resource!';
    techerrorres.messagecode = 5000;

    res.status(techerrorres.status).send(techerrorres);
  });

app.use(function (err, req, res, next) {
console.error(err.stack);

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
        techerrorres.messagecode = 1011;
    }
    else {
        techerrorres.message = 'Internal Server Error! ' + err.message;
        techerrorres.messagecode = 5001;
    }

res.status(techerrorres.status).send(techerrorres);
});

const port = process.env.PORT || config.PORT || 3057;

app.listen(port, () => {
    console.log('Server is running on the port' + port);
});