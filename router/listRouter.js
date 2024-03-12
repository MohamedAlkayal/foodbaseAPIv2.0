const router = require("express").Router();

const { createList, getOneList, updateOrderState, deleteList } = require("../controller/listController");

router.route("/").post(createList);
router.route("/:list_id").get(getOneList).delete(deleteList).patch(updateOrderState);

module.exports = router;
