const jwt   = require('jsonwebtoken');
const config = require('../config.json');
const techerrorres = require('../src/schemas/api.response.techerror');
const winston = require('./winston');

let secret = config.secret;
let tokenexpiry = config.jwtexpiresin?config.jwtexpiresin:"15d";
let tokenalgorithm = config.jwtalgorithm?config.jwtalgorithm:"HS256";

module.exports = {
  getToken: (req, res, next) => {
      const header = req.headers['authorization'];

      if(typeof header !== 'undefined') {
          const bearer = header.split(' ');
          const token = bearer[1];

          req.token = token;
          winston.info(`token: ${token} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

          next();
      }
      else{
        winston.info(`error while getting token. - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        techerrorres.status=403;
        techerrorres.message = 'Error while getting token!';
        techerrorres.messagecode = 5002;
    
        res.status(techerrorres.status).send(techerrorres);
      }
  },

  sign: (payload, $Options) => {
  // Token signing options
  let signOptions = {
      issuer:  $Options.issuer,
      subject:  $Options.subject,
      audience:  $Options.audience,
      expiresIn:  tokenexpiry,
      algorithm:  tokenalgorithm
  };
  winston.info(`${signOptions.issuer}  - ${signOptions.subject} - ${signOptions.audience} - ${signOptions.expiresIn} - ${signOptions.algorithm} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  return jwt.sign(payload, secret, signOptions);
},

verify: (token, $Option) => {

  let verifyOptions = {
      issuer:  $Option.issuer,
      subject:  $Option.subject,
      audience:  $Option.audience,
      expiresIn:  tokenexpiry,
      algorithm:  [tokenalgorithm]
  };
   try{
     return jwt.verify(token, secret, verifyOptions);
   }catch (err){
    winston.error(`${err.status || 500} - ${err.message}`);
     return false;
   }
},

 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}