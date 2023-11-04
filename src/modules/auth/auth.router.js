import { Router } from "express";
import * as AuthController from "../auth/auth.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.post(
  "/signup",
  fileUpload(fileValidation.image).single("image"),
  AuthController.signup
);
router.get("/login", AuthController.login);

export default router;
