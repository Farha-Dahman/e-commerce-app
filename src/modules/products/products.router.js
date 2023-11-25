import { Router } from "express";
import * as productsRouter from "./products.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./product.endpoint.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.get("/", productsRouter.getProducts);
router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  productsRouter.createProduct
);

export default router;
