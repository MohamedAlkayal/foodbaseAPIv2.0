const List = require("../model/listModel.js");
const Group = require("../model/groupModel.js");
const CustomError = require("../utility/errorObject");
const Order = require("../model/orderModel.js");

async function createList(req, res, next) {
  try {
    // find group meanted by list
    const group_id = req.body.group;
    const group = await Group.findById(group_id);
    // find user creating list
    const user_id = req.user._id;
    // check if user is a member in the meanted group
    if (!group.members.includes(user_id)) {
      throw new CustomError("Unauthorized", "You must be a member of a group to create a list in it", 401);
    }
    // check group permissions
    if (group.owner == user_id || group.usersPermission.createOrderList) {
      const list = req.body;
      list.createdBy = user_id;
      const createdList = await List.create(list);
      console.log(createdList);
      group.orderLists.push(createdList._id);
      group.save();
      res.json({
        status: "success",
        data: createdList,
      });
    } else {
      throw new CustomError("Unauthorized", "You don't have the permission to create a list", 401);
    }
  } catch (err) {
    next(err);
  }
}

async function getOneList(req, res, next) {
  try {
    const list = await List.findById(req.params.list_id)
      .populate({
        path: "createdBy",
        select: "username",
      })
      .populate({
        path: "group",
        select: "name members",
      })
      .populate({
        path: "orders",
        populate: [{ path: "user" }],
      })
      .populate("restaurant");

    if (!list.group.members.includes(req.user._id)) {
      throw new CustomError("Unauthorized", "You must be a member of a group to view a list in it", 401);
    }

    res.json({
      data: list,
    });
  } catch (err) {
    next(err);
  }
}

async function updateOrderState(req, res, next) {
  try {
    const list = await List.findById(req.params.list_id);

    if (req.user._id != list.createdBy) {
      throw new CustomError("Unauthorized", "You don't have the permission to update this list", 401);
    }

    list.state = req.body.state;
    await list.save();

    res.json({
      data: "list state updated",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteList(req, res, next) {
  try {
    const list = await List.findById(req.params.list_id);
    if (req.user._id != list.createdBy) {
      throw new CustomError("Unauthorized", "You don't have the permission to update this list", 401);
    }

    const group = await Group.findById(list.group);
    group.orderLists = group.orderLists.filter((listId) => listId.toString() !== list._id.toString());
    await group.save();

    await Order.deleteMany({ list: req.params.list_id });
    List.findByIdAndDelete(req.params.list_id);
    res.json({
      data: "List deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createList, getOneList, updateOrderState, deleteList };
