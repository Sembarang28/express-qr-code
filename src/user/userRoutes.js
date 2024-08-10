const { Router } = require("express");
const userAbsentController = require("./absent/userAbsentController");
const userProfileController = require("./profile/userProfileController");
const userSession = require("./middleware/userSession");

const userRoutes = new Router();

userRoutes.use("/absent", userSession, userAbsentController);
userRoutes.use("/profile", userSession, userProfileController);

module.exports = userRoutes;
