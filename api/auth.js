const express = require('express');
const router = express.Router();
const User = require('../models/User');
const util = require('../util');
const jwt = require('jsonwebtoken');

// login
router.post('/login', 
  (req,res,next) => {
    let isValid = true;
    const validationError = {
      name: 'ValidationError',
      errors: {}
    };

    if(!req.body.username){
      isValid = false;
      validationError.errors.username = { message:'Username is required!' };
    }
    if(!req.body.password){
      isValid = false;
      validationError.errors.password = { message:'Password is required!' };
    }

    if (!isValid) return res.json(util.successFalse(validationError));
    else next();
  },
  (req, res, next) => {
    User.findOne({ username:req.body.username })
    .select({ password:1, username:1, name:1, email:1 })
    .exec((err,user) => {
      if (err) return res.json(util.successFalse(err));
      else if(!user||!user.authenticate(req.body.password))
         return res.json(util.successFalse(null, 'Username or Password is invalid'));
      else {
        const payload = {
          _id : user._id,
          username: user.username
        };
        const secretOrPrivateKey = process.env.JWT_SECRET || 'abcd';
        const options = { expiresIn: 60*60*24 };
        jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
          if (err) return res.json(util.successFalse(err));
          res.json(util.successTrue(token));
        });
      }
    });
  }
);

// me
router.get('/me', util.isLoggedin, (req, res, next) => {
  User.findById(req.decoded._id)
  .exec(function(err,user){
    if (err||!user) return res.json(util.successFalse(err));
    res.json(util.successTrue(user));
  });
});

// refresh
router.get('/refresh', util.isLoggedin, (req, res, next) => {
  User.findById(req.decoded._id)
  .exec((err,user) => {
    if (err||!user) return res.json(util.successFalse(err));
    else {
      var payload = {
        _id : user._id,
        username: user.username
      };
      const secretOrPrivateKey = process.env.JWT_SECRET;
      const options = { expiresIn: 60*60*24 };
      jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
        if (err) return res.json(util.successFalse(err));
        res.json(util.successTrue(token));
      });
    }
  });
});

module.exports = router;