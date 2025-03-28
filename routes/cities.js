var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
require("../models/connection");
const City = require("../models/cities");
const User = require("../models/user");

const API_KEY = process.env.API_KEY;

router.post("/new", async (req, res) => {
  const user = await User.findOne({ token: req.body.userToken });
  if (!user) {
    res.json({ result: false, error: "user not found" });
    return;
  }
  const user_Id = user._id;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.body.name}&appid=${API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const newCity = new City({
        user_id: user_Id,
        name: req.body.name,
        main: data.weather[0].main,
        description: data.weather[0].description,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
      });
      newCity.save().then((data) => {
        res.json({ result: true, city: data });
      });
    });
});

router.get("/:userToken", async (req, res) => {
  const user = await User.findOne({ token: req.params.userToken });
  if (!user) {
    res.json({ result: false, error: "User not found" });
    return;
  }
  const city = await City.find({ user_id: user._id }).select("-user_id");
  if (city.length > 0) {
    res.json({ result: true, city });
  } else {
    res.json({ result: false, error: "Not history found" });
  }
});

router.delete("/:name", (req, res) => {
  City.deleteOne({
    name: { $regex: new RegExp(req.params.name, "i") },
  }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      // City successfully deleted, send success response
      res.json({ result: true });
    } else {
      // City not found in the database
      res.json({ result: false, error: "City not found" });
    }
  });
});

module.exports = router;
