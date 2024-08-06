const { Router } = require("express");
const response = require("../../config/response");
const profileModel = require("./profileModel");
const multer = require("../../config/multer");
const sharp = require("../../config/sharp");

const adminProfileController = new Router();

adminProfileController.get("/dashboard", async (req, res) => {
  const { date } = req.query;
  const readDashboardData = await profileModel.readDashboardData(date);
  return response(res, readDashboardData);
});

adminProfileController.get("/", async (req, res) => {
  const { id } = req.user;
  const readUserProfile = await profileModel.readUserProfile(id);
  return response(res, readUserProfile);
});

adminProfileController.put("/pass", async (req, res) => {
  const { id } = req.user;
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .max(64)
      .pattern(new RegExp("^[a-zA-Z0-9]{8,64}$"))
      .required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const errorDetails = validation.error.details.map(
      (detail) => detail.message,
    );

    const responseBody = {
      status: false,
      message: "failed",
      code: 422,
      error: errorDetails.join(", "),
    };

    return response(res, responseBody);
  }

  if (req.body.confirmPassword !== req.body.newPassword) {
    const responseBody = {
      status: false,
      message: "Password baru dan password konfirmasi tidak sama!",
      code: 400,
    };

    return response(res, responseBody);
  }

  const updateUserPassword = await profileModel.updateUserPassword(
    id,
    req.body,
  );
  return response(res, updateUserPassword);
});

adminProfileController.put("/", multer.userImg("image"), async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    nip: Joi.optional(),
    employeeStatus: Joi.optional(),
    role: Joi.string().required(),
    image: Joi.optional(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const errorDetails = validation.error.details.map(
      (detail) => detail.message,
    );

    const responseBody = {
      status: false,
      message: "failed",
      code: 422,
      error: errorDetails.join(", "),
    };

    return response(res, responseBody);
  }

  if (req.file) {
    sharp.userImg(req.file);
  }

  const imageName = sharp.filename;
  const imagePath = imageName ? `public/userImg/${imageName}` : null;

  const updateAdminProfile = await profileModel.updateUserProfile(
    id,
    req.body,
    imagePath,
  );
  sharp.filename = "";
  return response(res, updateAdminProfile);
});

module.exports = adminProfileController;
