const router = require("express").Router();

const { createOrder } = require("../controller/orderController");

router.route("/").post(createOrder);

module.exports = router;
