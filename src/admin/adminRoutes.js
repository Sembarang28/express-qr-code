const { Router } = require("express");
const userController = require("./user/userController");
const adminSession = require("./middleware/adminSession");
const adminProfileController = require("./profile/profileController");

const adminRoutes = new Router();

adminRoutes.use("/user", adminSession, userController);
adminRoutes.use("/profile", adminSession, adminProfileController);

module.exports = adminRoutes;
