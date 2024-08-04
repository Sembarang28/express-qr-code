const response = require("../config/response");
const Joi = require("joi");
const { Router } = require("express");
const authModel = require("./authModel");

const authController = new Router();

authController.post("/login", async function (req, res) {
  const schema = Joi.object({
    email: Joi.string().required(),
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

  const login = await authModel.login(req.body.email, req.body.password);
  return response(res, login);
});

authController.post("/forgot", async function (req, res) {
  const schema = Joi.object({
    email: Joi.string().required(),
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

    return response.sendResponse(res, responseBody);
  }

  const forgotPassword = await authModel.forgotPassword(req.body.email);
  return response(res, forgotPassword);
});

authController.post("/reset", async function (req, res) {
  const schema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
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

    response(res, responseBody);
  }

  const resetPassword = await authModel.resetPassword(
    req.body.email,
    req.body.otp,
    req.body.password,
  );
  return response(res, resetPassword);
});

module.exports = authController;
