const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    items: [ItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
