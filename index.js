// core imports
const express = require("express");
const morgan = require("morgan");
const connect = require("./db");
const cors = require("cors");
require("dotenv").config(".env");

// routers
const userRouter = require("./router/userRouter.js");
const authRouter = require("./router/authRouter.js");
const groupRouter = require("./router/groupRouter.js");
const listRouter = require("./router/listRouter.js");
const restaurantRouter = require("./router/restaurantRouter.js");
const orderRouter = require("./router/orderRouter.js");

// middleware
const authorizer = require("./middleware/authorizer.js");
const errorHandler = require("./middleware/errorHandler.js");

// Create app server
const app = express();
const URI = process.env.URI;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routers
app.get("/", (req, res) => res.send("landing"));
app.use("/auth", authRouter);
app.use("/user", authorizer, userRouter);
app.use("/group", authorizer, groupRouter);
app.use("/list", authorizer, listRouter);
app.use("/restaurant", authorizer, restaurantRouter);
app.use("/order", authorizer, orderRouter);

// Error Handler
app.use(errorHandler);

// Server & db
connect(URI);
app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});
