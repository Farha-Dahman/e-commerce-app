import { Router } from "express";
import { endPoints } from "./cart.endpoint.js";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();
router.post("/", auth(endPoints.create), cartController.createCart);
router.patch("/removeItem", auth(endPoints.delete), cartController.removeItemFromCart);
router.patch("/clear", auth(endPoints.delete), cartController.clearCart);
router.get("/", auth(endPoints.get), cartController.getCart);

export default router;