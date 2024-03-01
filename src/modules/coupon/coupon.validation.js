import joi from "joi";
import { generalFelids } from "../../middleware/validation.js";

export const createCouponSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  amount: joi.number().integer().min(0).max(100).required(),
});

export const updateCouponSchema = joi.object({
  id: generalFelids.id,
  name: joi.string().min(3).max(50),
  amount: joi.number().integer().min(0).max(100),
}).min(1);;
