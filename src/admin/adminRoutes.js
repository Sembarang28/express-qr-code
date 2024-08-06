const { Router } = require("express");
const userController = require("./user/userController");
const adminSession = require("./middleware/adminSession");

const adminRoutes = new Router();

adminRoutes.use("/user", adminSession, userController);

module.exports = adminRoutes;
