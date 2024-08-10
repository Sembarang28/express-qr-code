const { Router } = require("express");
const Joi = require("joi");
const multer = require("../../config/multer");
const sharp = require("../../config/sharp");
const userPermissionModel = require("./userPermissionModel");
const response = require("../../config/response");

const userPermissionController = new Router();

userPermissionController.post(
  "/",
  multer.permissionImg("image"),
  async (req, res) => {
    const userId = req.user.id;
    const schema = Joi.object({
      permission: Joi.string().required(),
      information: Joi.optional(),
      photo: Joi.optional(),
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
      sharp.permissionImg(req.file);
    }
    const imageName = sharp.filename;
    const imagePath = imageName ? `assets/permissionImg/${imageName}` : null;

    const createPermission = await userPermissionModel.createPermission(
      userId,
      req.body,
      imagePath,
    );
    sharp.filename = "";
    return response(res, createPermission);
  },
);

userPermissionController.get("/", async (req, res) => {
  const userId = req.user.id;
  const { page, search } = req.query;
  const readAllPermission = await userPermissionModel.readAllPermission(
    userId,
    Number(page),
    search,
  );
  return response(res, readAllPermission);
});

userPermissionController.get("/:permissionId", async (req, res) => {
  const { permissionId } = req.user.id;
  const readPermissionById =
    await userPermissionModel.readPermissionById(permissionId);
  return response(res, readPermissionById);
});

userPermissionController.put("/:permissionId", async (req, res) => {
  const { permissionId } = req.params;
  const userId = req.user.id;
  const schema = Joi.object({
    permission: Joi.string().required(),
    information: Joi.optional(),
    photo: Joi.optional(),
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
    sharp.permissionImg(req.file);
  }
  const imageName = sharp.filename;
  const imagePath = imageName ? `assets/permissionImg/${imageName}` : null;

  const updatePermissionById = await userPermissionModel.updatePermissionById(
    id,
    req.body,
    imagePath,
  );
  sharp.filename = "";
  return response(res, updatePermissionById);
});

userPermissionController.delete("/:permissionId", async (req, res) => {
  const { permissionId } = req.params;
  const deletePermissionById =
    await userPermissionModel.deletePermissionById(permissionId);
  return response(res, deletePermissionById);
});

module.exports = userPermissionController;
