var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
require('../models/connection')
const City = require("../models/cities");

const API_KEY = process.env.API_KEY;

router.post("/new", (req, res) => {
  City.findOne({ name: { $regex: new RegExp(req.body.name, "i") } }).then(
    (dataDb) => {
      if (dataDb === null) {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${req.body.name}&appid=${API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            const newCity = new City({
              name: req.body.name,
              main: data.weather[0].main,
              description: data.weather[0].description,
              tempMin: data.main.temp_min,
              tempMax: data.main.temp_max,
            });
            newCity.save().then((data) => {
              res.json({ result: true, citie: data });
            });
          });
      }
    }
  );
});

router.get("/all", (req, res) => {
  City.find().then((data) => {
    if (data) {
      res.json({ result: true, weather: data });
    }
  });
});

router.get("/:city", (req, res) => {
  City.findOne({
    name: { $regex: new RegExp(req.params.name, "i") },
  }).then((data) => {
    if (data) {
      res.json({ result: true, weather: data });
    } else {
      res.json({ result: false, error: "City not found" });
    }
  });
});

router.delete('/:city', (req, res) => {
    City.deleterOne({name : { $regex: new RegExp(req.params.name, "i") }}).then(data => {
        if(data.deleteCount > 0) {
            City.find().then(city => {
                res.json({result : true, weather : city})
            }) 
        } else {
            res.json({result : false, error : 'City not found'})
        }
    }) 
})

module.exports = router;
