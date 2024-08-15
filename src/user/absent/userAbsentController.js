const { Router } = require("express");
const userAbsentModel = require("./userAbsentModel");
const response = require("../../config/response");
const Joi = require("joi");

const userAbsentController = new Router();

userAbsentController.get("/", async (req, res) => {
  const userId = req.user.id;
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

  const readAllAbsentMonth = await userAbsentModel.readAllAbsentsMonthByUserId(
    req.query,
    userId,
  );
  return response(res, readAllAbsentMonth);
});

module.exports = userAbsentController;
