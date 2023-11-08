import { Router } from "express";
import * as categoriesController from "./categories.controller.js";
import subcategoryRouter from "./../subcategory/subcategory.router.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./category.endpoint.js";
const router = Router();

router.use("/:id/subcategory", subcategoryRouter);
router.get(
  "/active",
  auth(endPoints.getActive),
  categoriesController.getActiveCategories
);
router.get("/", auth(endPoints.getAll), categoriesController.getCategories);
router.get(
  "/:id",
  auth(endPoints.specific),
  categoriesController.getSpecificCategories
);
router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).single("image"),
  categoriesController.createCategory
);
router.put(
  "/:id",
  auth(endPoints.update),
  fileUpload(fileValidation.image).single("image"),
  categoriesController.updateCategory
);
export default router;
