var express = require("express");
var router = express.Router();
const User = require("../models/users");
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
  if (!checkBody(req.body, ["firstName", "lastName", "password"])) {
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

module.exports = router;
