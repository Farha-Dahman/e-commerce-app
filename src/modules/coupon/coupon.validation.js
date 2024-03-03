import joi from "joi";
import { generalFelids } from "../../middleware/validation.js";

export const createCouponSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  amount: joi.number().integer().min(0).max(100).required(),
  expiredDate: joi.date().greater("now").required(),
});

export const updateCouponSchema = joi
  .object({
    id: generalFelids.id,
    name: joi.string().min(3).max(50),
    amount: joi.number().integer().min(0).max(100),
    expiredDate: joi.date().greater("now"),
  })
  .min(1);
