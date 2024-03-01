import { Router } from "express";
import * as categoriesController from "./categories.controller.js";
import subcategoryRouter from "./../subcategory/subcategory.router.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { auth, roles } from "../../middleware/auth.js";
import { endPoints } from "./category.endpoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./category.validation.js";
const router = Router();

router.use("/:id/subcategory", subcategoryRouter);
router.get(
  "/active",
  auth(endPoints.getActive),
  asyncHandler(categoriesController.getActiveCategories)
);
router.get(
  "/",
  auth(Object.values(roles)),
  asyncHandler(categoriesController.getCategories)
);
router.get(
  "/:id",
  auth(endPoints.specific),
  asyncHandler(categoriesController.getSpecificCategory)
);
router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createCategorySchema),
  asyncHandler(categoriesController.createCategory)
);
router.put(
  "/:id",
  auth(endPoints.update),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateCategorySchema),
  asyncHandler(categoriesController.updateCategory)
);
router.delete(
  "/:id",
  auth(endPoints.delete),
  asyncHandler(categoriesController.deleteCategory)
);

export default router;
