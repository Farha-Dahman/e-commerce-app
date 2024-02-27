import { Router } from "express";
import * as subcategoryController from "./subcategory.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { auth, roles } from "../../middleware/auth.js";
import { endPoints } from "./subcategory.endpoint.js";
const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(subcategoryController.createSubcategory)
);
router.get(
  "/all/:id",
  auth(Object.values(roles)),
  asyncHandler(subcategoryController.getSubcategories)
);
router.put(
  "/:id",
  auth(endPoints.update),
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(subcategoryController.updateSubcategory)
);
router.get(
  "/active",
  auth(endPoints.getActive),
  asyncHandler(subcategoryController.getActiveSubcategories)
);
router.get(
  "/sc/:id",
  auth(endPoints.specific),
  asyncHandler(subcategoryController.getSpecificSubcategory)
);
router.delete(
  "/:id",
  auth(endPoints.delete),
  asyncHandler(subcategoryController.deleteSubcategory)
);

export default router;
