import { Router } from "express";
import * as productsRouter from "./products.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./product.endpoint.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();

router.get("/", asyncHandler(productsRouter.getProducts));
router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  asyncHandler(productsRouter.createProduct)
);

export default router;
