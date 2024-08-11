const { Router } = require("express");
const adminSession = require("../middleware/adminSession");
const multer = require("../../config/multer");
const Joi = require("joi");
const response = require("../../config/response");
const sharp = require("../../config/sharp");
const userModel = require("./userModel");

const userController = new Router();

userController.post("/", multer.userImg("image"), async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .max(64)
      .pattern(new RegExp("^[a-zA-Z0-9]{8,64}$"))
      .required(),
    nip: Joi.optional(),
    employeeStatus: Joi.optional(),
    role: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const errorDetails = validation.error.details.map(
      (detail) => detail.message,
    );

    const responseBody = {
      status: false,
      message: errorDetails.join(", "),
      code: 422,
    };
    return response(res, responseBody);
  }

  if (req.file) {
    sharp.userImg(req.file);
  }
  const imageName = sharp.filename;
  const imagePath = imageName ? `public/userImg/${imageName}` : "";

  const createUser = await userModel.creatUser(req.body, imagePath);
  sharp.filename = "";
  return response(res, createUser);
});

userController.get("/all", async (req, res) => {
  const { search } = req.query;
  const readAllUsers = await userModel.readAllUser(search);
  return response(res, readAllUsers);
});

userController.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const readUserById = await userModel.readUserById(Number(userId));
  return response(res, readUserById);
});

userController.put("/pass/:userId", async (req, res) => {
  const { userId } = req.params;
  const schema = Joi.object({
    password: Joi.string()
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

  const updateUserPasswordById = await userModel.updateUserPasswordById(
    Number(userId),
    req.body,
  );
  return response(req, updateUserPasswordById);
});

userController.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    nip: Joi.optional(),
    employeeStatus: Joi.optional(),
    role: Joi.string().required(),
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
    sharp.userImg(file);
  }

  const imageName = sharp.filename;
  const imagePath = imageName ? `public/userImg/${imageName}` : "";

  const updateUserById = await userModel.updateUserAccountById(
    Number(userId),
    req.body,
    imagePath,
  );
  return response(res, updateUserById);
});

userController.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const deleteUserById = await userModel.deleteUser(Number(userId));
  return response(res, deleteUserById);
});

module.exports = userController;
