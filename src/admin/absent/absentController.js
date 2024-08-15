const { Router } = require("express");
const Joi = require("joi");
const absentModel = require("./absentModel");
const response = require("../../config/response");

const adminAbsentController = new Router();

adminAbsentController.post("/scan", async (req, res) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    date: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const errorDetails = validation.error.details.map(
      (detail) => detail.message,
    );

    const responseBody = {
      status: false,
      message: "Lengkapi inputan data",
      code: 422,
      error: errorDetails.join(", "),
    };

    return response(res, responseBody);
  }

  const scanqr = await absentModel.scanqr(req.body);
  return response(res, scanqr);
});

adminAbsentController.post("/", async (req, res) => {
  const schema = Joi.object({
    absentDateId: Joi.string().required(),
    userId: Joi.string().required(),
    status: Joi.optional(),
    information: Joi.optional(),
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

  const createAbsent = await absentModel.createAbsent(req.body);
  return response(res, createAbsent);
});

adminAbsentController.get("/all", async (req, res) => {
  const readAllAbsent = await absentModel.readAllAbsent();
  return response(res, readAllAbsent);
});

adminAbsentController.get("/date", async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().required(),
  });

  const validation = schema.validate(req.query);

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

  const readAllAbsentByDate = await absentModel.readAllAbsentByDate(req.query);
  return response(res, readAllAbsentByDate);
});

adminAbsentController.get("/month", async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().required(),
  });

  const validation = schema.validate(req.query);

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

  const readAllAbsentByMonth = await absentModel.readAllAbsentByMonth(
    req.query,
  );
  return response(res, readAllAbsentByMonth);
});

adminAbsentController.get("/:absentId", async (req, res) => {
  const { absentId } = req.params;
  const readAbsentById = await absentModel.readAbsentById(absentId);
  return response(res, readAbsentById);
});

adminAbsentController.put("/:absentId", async (req, res) => {
  const { absentId } = req.params;
  const schema = Joi.object({
    status: Joi.string().required(),
    information: Joi.optional(),
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

  const updateAbsentById = await absentModel.updateAbsentById(
    absentId,
    req.body,
  );
  return response(res, updateAbsentById);
});

adminAbsentController.delete("/:absentId", async (req, res) => {
  const { absentId } = req.params;
  const deleteAbsentById = await absentModel.deleteAbsentById(absentId);
  return response(res, deleteAbsentById);
});

module.exports = adminAbsentController;
