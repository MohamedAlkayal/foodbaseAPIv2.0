const List = require("../model/listModel");
const Order = require("../model/orderModel");
const User = require("../model/userModel");

async function createOrder(req, res, next) {
  const list = await List.findById(req.body.list);
  const createdOrder = await Order.create(req.body);
  const user = await User.findById(createdOrder.user);

  user.orders.push(createdOrder._id);
  await user.save();
  list.orders.push(createdOrder._id);
  await list.save();

  res.json({
    data: createdOrder,
  });

  try {
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder };
