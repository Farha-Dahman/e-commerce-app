import joi from "joi";
import { Types } from "mongoose";

const validationObjectID = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return value;
  } else {
    return helper.error("any.custom", { message: "Invalid ObjectId" });
  }
};

export const generalFelids = {
  id: joi.string().custom(validationObjectID).required(),
  email: joi.string().email().required().min(5).messages({
    "string.empty": "email is required",
    "string.email": "plz enter a valid email",
    "string.min": "email length must be at least 5 characters",
  }),
  password: joi.string().min(5).required().messages({
    "string.empty": "password is required",
  }),
  file: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().positive().required(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputsData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "validation error",
        validationError: validationResult.error?.details,
      });
    }
    next();
  };
};
