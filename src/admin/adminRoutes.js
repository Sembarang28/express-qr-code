const { Router } = require("express");
const userController = require("./user/userController");
const adminSession = require("./middleware/adminSession");
const adminProfileController = require("./profile/profileController");
const adminPermissionController = require("./permission/permissionController");
const adminAbsentDateController = require("./absentDate/absentDateController");
const adminAbsentController = require("./absent/absentController");

const adminRoutes = new Router();

adminRoutes.use("/user", adminSession, userController);
adminRoutes.use("/profile", adminSession, adminProfileController);
adminRoutes.use("/permission", adminSession, adminPermissionController);
adminRoutes.use("/absent/date", adminSession, adminAbsentDateController);
adminRoutes.use("/absent", adminSession, adminAbsentController);

module.exports = adminRoutes;
