import joi from "joi";
import { generalFelids } from "../../middleware/validation.js";

export const createCategorySchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  file: generalFelids.file.required(),
  // file: joi.array().items(generalFelids.file.required()).required(),
});

export const updateCategorySchema = joi
  .object({
    name: joi.string().min(3).max(30),
    file: generalFelids.file,
  })
  .min(1);
