const router = require("express").Router();
const { getProfile, updateProfile, updatePassword } = require("../controller/userController");

router.route("/").get(getProfile).patch(updateProfile);
router.route("/password").patch(updatePassword);

module.exports = router;
