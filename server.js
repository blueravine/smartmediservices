const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');
const response = require('./src/schemas/api.response.testresult');


//Import routes for the test result
const testresult = require('./src/routes/testresult.route');

//Import routes for the test
const test = require('./src/routes/test.route');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/testresult', testresult);
app.use('/test', test);

app.use(function (req, res, next) {
    console.log("Cannot find RESTful resource!");

    response.status=404;
    response.message = 'Cannot find RESTful resource!';
    response.TestResult=null;
    response.token=null;

    res.status(response.status).send(response);
  });

app.use(function (err, req, res, next) {
console.error(err.stack);

response.status=500;
response.message = 'Internal Server Error!';
response.TestResult=null;
response.token=null;

res.status(response.status).send(response);
});

const port = process.env.PORT || config.PORT || 3056;

app.listen(port, () => {
    console.log('Server is running on the port' + port);
});