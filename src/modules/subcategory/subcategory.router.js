import { Router } from "express";
import * as subcategoryController from "./subcategory.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router({mergeParams:true});

router.post(
    "/",
    fileUpload(fileValidation.image).single("image"),
    subcategoryController.createSubcategory
);
router.get('/', subcategoryController.getSubcategory);
    
export default router;