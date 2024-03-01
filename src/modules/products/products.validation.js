import joi from "joi";
import { generalFelids } from "../../middleware/validation.js";

export const createProductSchema = joi
  .object({
    name: joi.string().min(3).max(25).required(),
    description: joi.string().max(500),
    stock: joi.number().integer().min(0).required(),
    price: joi.number().positive().required(),
    discount: joi.number().positive().min(0).max(100),
    file: joi.object({
      mainImage: joi.array().items(generalFelids.file.required()).length(1),
      subImages: joi.array().items(generalFelids.file.required()).min(2).max(4),
    }),
    status: joi.string().valid("Active", "Inactive"),
    size: joi.array().valid("S", "M", "Lg", "XL"),
    color: joi.array().items(joi.string()),
    category: joi.string().required(),
    subcategory: joi.string().required(),
  })
  .required();

export const updateProductSchema = joi
  .object({
    id: generalFelids.id,
    name: joi.string().min(3).max(30),
    status: joi.string().valid("Active", "Inactive"),
    description: joi.string().max(500),
    file: joi.object({
      mainImage: joi.array().items(generalFelids.file).length(1),
      subImages: joi.array().items(generalFelids.file).min(2).max(4),
    }),
    stock: joi.number().integer().min(0),
    color: joi.array().items(joi.string()),
    size: joi.array().items(joi.string().valid("S", "M", "Lg", "XL")),
    price: joi.number().positive(),
    discount: joi.number().min(0).max(100),
  })
  .min(1);
