var jwt = require('jsonwebtoken');

var util = {};

util.successTrue = (data) => {
  return {
    success: true,
    message: null,
    errors: null,
    data: data
  };
};

util.successFalse = (err, message) => { //2
  if(!err && !message) {
    message = 'data not found';
  }
  return {
    success: false,
    message: message,
    errors: err ? util.parseError(err) : null,
    data: null
  };
};

util.parseError = (errors) => {
  const parsed = {};
  if(errors.name == 'ValidationError'){
    for(let name in errors.errors){
      const validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code == '11000' && errors.errmsg.includes('username')) {
    parsed.username = { message:'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
const JWT_SECRET = process.env.JWT_SECRET || 'abcd';
util.isLoggedin = (req, res, next) => {
  var token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null, 'token is required!'));
  else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err) return res.json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = util;