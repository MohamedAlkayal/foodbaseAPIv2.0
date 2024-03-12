const Group = require("../model/groupModel.js");
const User = require("../model/userModel.js");
const List = require("../model/listModel.js");
const Order = require("../model/orderModel.js");
const CustomError = require("../utility/errorObject.js");

async function createGroup(req, res, next) {
  try {
    const group = req.body;
    group.members = [req.user._id];
    group.owner = req.user._id;
    const createdGroup = await Group.create(group);
    const user = await User.findById(req.user._id);
    user.groups.push(createdGroup._id);
    await User.findByIdAndUpdate(req.user._id, user);
    res.json({
      status: "success",
      data: createdGroup,
    });
  } catch (err) {
    next(err);
  }
}

async function getOneGroup(req, res, next) {
  try {
    const groupData = await Group.findById(req.params.group_id)
      .populate({
        path: "orderLists",
        populate: [{ path: "createdBy" }, { path: "restaurant" }],
      })
      .populate("owner")
      .populate("members");
    res.json({
      status: "success",
      data: groupData,
    });
  } catch (err) {
    next(err);
  }
}

async function updateGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.group_id);
    if (req.body.usersPermission && group.owner.toString() !== req.user._id.toString()) {
      throw new CustomError("Unuthorized", "Only the group owner could update permissions", 401);
    }
    if (group.owner.toString() === req.user._id.toString() || group.usersPermission.editInfo) {
      await Group.findByIdAndUpdate(req.params.group_id, req.body);
      res.json({
        status: "success",
        message: "group info is updated",
        data: await Group.findById(req.params.group_id),
      });
    } else {
      throw new CustomError("Unuthorized", "Editing group info is for moderators only", 401);
    }
  } catch (err) {
    next(err);
  }
}

async function joinGroup(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const group = await Group.findById(req.params.group_id);
    if (!group) {
      throw new CustomError("Not Found", "The group you're trying to join is not found", 404);
    }
    const members = group.members;
    for (let i = 0; i < members.length; i++) {
      if (members[i]._id.toString() === user._id.toString()) {
        throw new CustomError("Conflict", `You're alreday a member in ${group.name}`, 409);
      }
    }
    members.push(req.user._id);
    await Group.findByIdAndUpdate(req.params.group_id, { members: members });
    user.groups.push(group._id);
    await User.findByIdAndUpdate(req.user._id, user);
    res.json({
      status: "success",
      message: `You're now a member in ${group.name}`,
    });
  } catch (err) {
    next(err);
  }
}

async function leaveGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.group_id);

    if (!group) {
      throw new CustomError("Not Found", "The group you're trying to leave is not found", 404);
    }

    const user = await User.findById(req.user._id);
    const memberIndex = group.members.indexOf(req.user._id);

    if (memberIndex === -1) {
      throw new CustomError("Not Found", "The user trying to leave is not a member of this group", 404);
    }

    group.members.splice(memberIndex, 1);

    if (group.members.length === 0) {
      await deleteGroup(req, res, next);
      return;
    }

    if (group.owner.toString() === req.user._id.toString()) {
      group.owner = group.members[0];
    }

    await group.save();

    const userGroups = user.groups.filter((groupId) => groupId.toString() !== group._id.toString());
    user.groups = userGroups;
    await user.save();

    res.json({
      status: "success",
      message: `You left ${group.name}`,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.group_id);

    if (!group) {
      throw new CustomError("Not found", "Group not found", 404);
    }

    if (!(group.owner == req.user._id)) {
      throw new CustomError("Unauthorized", "Deleting group is for owner only", 401);
    }

    const members = group.members;

    for (const userId of members) {
      const user = await User.findById(userId);
      user.groups = user.groups.filter((groupId) => groupId.toString() !== group._id.toString());
      await user.save();
    }

    await List.deleteMany({ group: req.params.group_id });
    await Order.deleteMany({ group: req.params.group_id });
    await Group.findByIdAndDelete(req.params.group_id);

    res.json({
      status: "success",
      message: `${group.name} is deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createGroup,
  getOneGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
};
