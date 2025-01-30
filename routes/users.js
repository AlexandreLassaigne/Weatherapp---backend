var express = require("express");
var router = express.Router();
const User = require("../models/user");
require('../models/connection')
const { checkBody } = require("../modules/checkBody");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ firstName: req.body.firstName }).then((data) => {
    if (data) {
      res.json({ result: false, error: "User already exist" });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((data) => {
        res.json({
          result: true,
          user: {
            token: data.token,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        });
      });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["firstName", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ firstName: req.body.firstName }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        user: {
          token: data.token,
          firstName: data.firstName,
          lastName: req.body.lastName,
        },
      });
    } else {
      res.json({result : false, errror : 'User not found'})
    }
  });
});

router.put('changeFirstName', async (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const user = await User.findOne({token : req.body.token})
    if(!user){
      res.json({result : false, error : 'User not found'})
      return
    }
    if(firstName === user.firstName) {
      res.json({result : false, error : 'FirstName has not change'})
      return
    }
    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.json({result : false, error : 'Password invalid'})
      return
    }
    user.firstName = firstName;
    user.save()
    .then(data => {
      res.json({result : true, newFirstName : data.firstName})
    })
})

router.put('changeLastName', async (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const user = await User.findOne({token : req.body.token})
    if(!user){
      res.json({result : false, error : 'User not found'})
      return
    }
    if(lastName === user.lastName) {
      res.json({result : false, error : 'LastName has not change'})
      return
    }
    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.json({result : false, error : 'Password invalid'})
      return
    }
    user.lastName = lastName;
    user.save()
    .then(data => {
      res.json({result : true, newFirstName : data.lastName})
    })
})

router.put('changePassword', async (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "password", "newPassword"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const user = await User.findOne({token : req.body.token})
    if(!user){
      res.json({result : false, error : 'User not found'})
      return
    }
    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.json({result : false, error : 'Password invalid'})
      return
    }
    if(bcrypt.compareSync(req.body.newPassword, user.password)) {
      res.json({result : false, error : 'Password has not change'})
      return
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    user.save()
    .then(() => {
      res.json({result : true, error : user})
    })
})

module.exports = router;
