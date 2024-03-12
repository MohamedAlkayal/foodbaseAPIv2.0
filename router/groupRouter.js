const router = require("express").Router();

const { createGroup, getOneGroup, updateGroup, joinGroup, leaveGroup, deleteGroup } = require("../controller/groupController");

router.route("/").post(createGroup);
router.route("/:group_id").post(joinGroup).get(getOneGroup).patch(updateGroup).delete(deleteGroup);
router.route("/leave/:group_id").post(leaveGroup);
module.exports = router;
