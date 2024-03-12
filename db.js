const mongoose = require("mongoose");

const connect = (URI) => {
  mongoose
    .connect(URI)
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect;
