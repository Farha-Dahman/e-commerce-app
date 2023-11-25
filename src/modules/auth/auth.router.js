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
router.put("/confirmEmail/:token", AuthController.confirmEmail);
router.patch("/sendCode", AuthController.sendCode);
router.patch("/forgetPassword", AuthController.forgetPassword);

export default router;
