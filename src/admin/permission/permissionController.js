const { Router } = require("express");
const multer = require("../../config/multer");
const sharp = require("../../config/sharp");
const permissionModel = require("./permissionModel");
const response = require("../../config/response");
const Joi = require("joi");

const adminPermissionController = new Router();

adminPermissionController.post(
  "/",
  multer.permissionImg("image"),
  async (req, res) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
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
    const imagePath = imageName ? `public/permissionImg/${imageName}` : "";

    const createPermission = await permissionModel.createPermission(
      req.body,
      imagePath,
    );
    sharp.filename = "";
    return response(res, createPermission);
  },
);

adminPermissionController.get("/all", async (req, res) => {
  const { search } = req.query;
  const readAllPermission = await permissionModel.readAllPermission(search);
  return response(res, readAllPermission);
});

adminPermissionController.get("/:permissionId", async (req, res) => {
  const { permissionId } = req.params;
  const readPermissionById = await permissionModel.readPermissionById(
    Number(permissionId),
  );
  return response(res, readPermissionById);
});

adminPermissionController.put(
  "/:permissionId",
  multer.permissionImg("image"),
  async (req, res) => {
    const { permissionId } = req.params;
    const schema = Joi.object({
      userId: Joi.string().required(),
      permission: Joi.string().required(),
      information: Joi.optional(),
      photo: Joi.optional(),
      verify: Joi.string().required(),
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
    const imagePath = imageName ? `public/permissionImg/${imageName}` : "";

    const updatePermissionById = await permissionModel.updatePermissionById(
      Number(permissionId),
      req.body,
      imagePath,
    );
    sharp.filename = "";
    return response(res, updatePermissionById);
  },
);

adminPermissionController.delete("/:permissionId", async (req, res) => {
  const { permissionId } = req.params;
  const deletePermissionById = await permissionModel.deletePermissionById(
    Number(permissionId),
  );
  return response(res, deletePermissionById);
});

module.exports = adminPermissionController;
