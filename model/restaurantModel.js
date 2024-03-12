const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    menuImages: {
      type: Array,
    },
    menuLink: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    items: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);
