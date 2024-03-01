import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./coupon.endpoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./coupon.validation.js";
const router = Router();

router.post(
  "/",
  auth(endPoints.create),
  validation(validators.createCouponSchema),
  asyncHandler(couponController.createCoupon)
);
router.get(
  "/",
  auth(endPoints.getAll),
  asyncHandler(couponController.getCoupon)
);
router.get(
  "/:id",
  auth(endPoints.getSpecific),
  asyncHandler(couponController.getSpecificCoupon)
);
router.put(
  "/:id",
  auth(endPoints.update),
  validation(validators.updateCouponSchema),
  asyncHandler(couponController.updateCoupon)
);
router.patch(
  "/softDelete/:id",
  auth(endPoints.delete),
  asyncHandler(couponController.softDelete)
);
router.delete(
  "/hardDelete/:id",
  auth(endPoints.delete),
  asyncHandler(couponController.hardDelete)
);
router.patch(
  "/restore/:id",
  auth(endPoints.restore),
  asyncHandler(couponController.restore)
);

export default router;
