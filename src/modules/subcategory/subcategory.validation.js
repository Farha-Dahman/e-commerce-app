import joi from "joi";
import { generalFelids } from "../../middleware/validation.js";

export const createSubcategorySchema = joi
  .object({
    name: joi.string().min(3).max(25).required(),
    file: generalFelids.file.required(),
    status: joi.string().valid("Active", "Inactive"),
    categoryName: joi.string().required(),
  })
  .required();

export const updateSubcategorySchema = joi
  .object({
    id: generalFelids.id,
    name: joi.string().min(3).max(25),
    file: generalFelids.file,
    status: joi.string().valid("Active", "Inactive"),
    categoryName: joi.string(),
  })
  .min(1);
