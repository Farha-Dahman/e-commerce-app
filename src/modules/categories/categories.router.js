import { Router } from "express";
import * as categoriesController from "./categories.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.get("/active", categoriesController.getActiveCategories);
router.get("/", categoriesController.getCategories);
router.get("/:id", categoriesController.getSpecificCategories);
router.post(
  "/",
  fileUpload(fileValidation.image).single("image"),
  categoriesController.createCategory
);
router.put(
  "/:id",
  fileUpload(fileValidation.image).single("image"),
  categoriesController.updateCategory
);
export default router;
