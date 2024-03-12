const { boolean, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserPermissionSchema = new Schema({
  editInfo: {
    type: Boolean,
    default: false,
  },
  createOrderList: {
    type: Boolean,
    default: false,
  },
});

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: `This group is dedicated to coordinating food ordering. Enjoy your meals!`,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    usersPermission: {
      type: UserPermissionSchema,
      default: {
        editInfo: false,
        createOrderList: false,
      },
    },
    orderLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
