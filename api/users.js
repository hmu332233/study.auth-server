var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util');

// private functions
const checkPermission = (req, res, next) => { //*
  User.findOne({username:req.params.username}, (err,user) => {
    if(err||!user) return res.json(util.successFalse(err));
    else if(!req.decoded || user._id != req.decoded._id) 
      return res.json(util.successFalse(null,'You don\'t have permission'));
    else next();
  });
}

// index
router.get('/', util.isLoggedin, (req, res, next) => {
  User.find({})
  .sort({ username: 1 })
  .exec((err,users) => {
    res.json(err||!users? util.successFalse(err): util.successTrue(users));
  });
});

// create
router.post('/', (req, res, next) => {
  const newUser = new User(req.body);
  newUser.save((err,user) => {
    res.json(err||!user? util.successFalse(err): util.successTrue(user));
  });
});

// show
router.get('/:username', util.isLoggedin, (req, res, next) => {
  User.findOne({username:req.params.username})
  .exec((err,user) => {
    res.json(err||!user? util.successFalse(err): util.successTrue(user));
  });
});

// update
router.put('/:username', util.isLoggedin, checkPermission, (req, res, next) => {
  User.findOne({ username: req.params.username })
  .select({ password:1 })
  .exec((err,user) => {
    if(err||!user) return res.json(util.successFalse(err));

    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword || user.password;
    for(let p in req.body){
      user[p] = req.body[p];
    }

    // save updated user
    user.save((err, user) => {
      if(err||!user) return res.json(util.successFalse(err));
      else {
        user.password = undefined;
        res.json(util.successTrue(user));
      }
    });
  });
});

// destroy
router.delete('/:username', util.isLoggedin, checkPermission, (req,res,next) => {
  User.findOneAndRemove({ username: req.params.username })
  .exec((err,user) => {
    res.json(err||!user? util.successFalse(err): util.successTrue(user));
  });
});

module.exports = router;