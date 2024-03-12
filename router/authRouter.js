const router = require("express").Router();
const { signup, login } = require("../controller/authController");

router.route("/login").post(login);
router.route("/signup").post(signup);

module.exports = router;
 