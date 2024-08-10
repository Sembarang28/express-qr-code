const { Router } = require("express");
const absentDateModel = require("./absentDateModel");
const response = require("../../config/response");
const Joi = require("joi");

const absentDateController = new Router();

absentDateController.post("/many", async (req, res) => {
  const schema = Joi.object({
    fromDate: Joi.string().required(),
    toDate: Joi.string().required(),
    dayStatus: Joi.string().required(),
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

  const createManyAbsentDate = await absentDateModel.createManyAbsentDate(
    req.body,
  );
  return response(res, createManyAbsentDate);
});

absentDateController.post("/", async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().required(),
    dayStatus: Joi.string().required(),
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

  const createAbsentDate = await absentDateModel.createAbsentDate(req.body);
  return response(res, createAbsentDate);
});

absentDateController.get("/all", async (req, res) => {
  const { month } = req.query;
  const readAllAbsentDate = await absentDateModel.readAllAbsentDate(month);
  return response(res, readAllAbsentDate);
});

absentDateModel.get("/:absentDateId", async (req, res) => {
  const { absentDateId } = req.params;
  const readAbsentDateById =
    await absentDateModel.readAbsentDateById(absentDateId);
  return response(res, readAbsentDateById);
});

absentDateController.put("/:absentDateId", async (req, res) => {
  const { absentDateId } = req.params;
  const schema = Joi.object({
    dayStatus: Joi.string().required(),
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

  const updateAbsentDateById = await absentDateModel.updateAbsentDateById(
    Number(id),
    req.body,
  );
  return response(res, updateAbsentDateById);
});

absentDateController.delete("/:absentDateId", async (req, res) => {
  const { absentDateId } = req.params;
  const deleteAbsentDateById = await absentDateModel.deleteAbsentDateById(
    Number(absentDateId),
  );
  return response(res, deleteAbsentDateById);
});

module.exports = absentDateController;
