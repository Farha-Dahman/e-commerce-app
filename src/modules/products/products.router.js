import { Router } from "express";
import * as productsRouter from "./products.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./product.endpoint.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./products.validation.js";
const router = Router();

router.get(
  "/",
  auth(endPoints.getAll),
  asyncHandler(productsRouter.getProducts)
);
router.get(
  "/:categoryId",
  auth(endPoints.getAll),
  asyncHandler(productsRouter.getProductsWithCategory)
);
router.get(
  "/:id",
  auth(endPoints.specific),
  asyncHandler(productsRouter.getSpecificProduct)
);
router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  validation(validators.createProductSchema),
  asyncHandler(productsRouter.createProduct)
);
router.put(
  "/:id",
  auth(endPoints.update),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  validation(validators.updateProductSchema),
  asyncHandler(productsRouter.updateProduct)
);
router.patch(
  "/softDelete/:id",
  auth(endPoints.delete),
  asyncHandler(productsRouter.softDelete)
);
router.delete(
  "/hardDelete/:id",
  auth(endPoints.delete),
  asyncHandler(productsRouter.hardDelete)
);
router.patch(
  "/restore/:id",
  auth(endPoints.restore),
  asyncHandler(productsRouter.restore)
);
router.patch(
  "/status/:id",
  auth(endPoints.status),
  asyncHandler(productsRouter.changeStatus)
);


export default router;
