import { Router } from "express";
import * as subcategoryController from "./subcategory.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router({ mergeParams: true });

router.post(
  "/",
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(subcategoryController.createSubcategory)
);
router.get("/", asyncHandler(subcategoryController.getSubcategory));

export default router;
