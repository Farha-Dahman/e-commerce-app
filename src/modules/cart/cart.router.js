import { Router } from "express";
import { endPoints } from "./cart.endpoint.js";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHandling.js";

const router = Router();
router.post("/", auth(endPoints.create), asyncHandler(cartController.createCart));
router.patch("/removeItem", auth(endPoints.delete), asyncHandler(cartController.removeItemFromCart));
router.patch("/clear", auth(endPoints.delete), asyncHandler(cartController.clearCart));
router.get("/", auth(endPoints.get), asyncHandler(cartController.getCart));

export default router;