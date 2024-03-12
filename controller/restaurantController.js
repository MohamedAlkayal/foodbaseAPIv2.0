const Restaurant = require("../model/restaurantModel");

async function createRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.json({
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
}

async function getRestaurants(req, res, next) {
  try {
    const restaurants = await Restaurant.find();
    res.json({
      data: restaurants,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createRestaurant, getRestaurants };
