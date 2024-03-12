const router = require("express").Router();

const { createRestaurant, getRestaurants } = require("../controller/restaurantController");
router.route("/").post(createRestaurant).get(getRestaurants);

module.exports = router;
