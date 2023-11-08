import bcrypt from "bcryptjs";
import userModel from "../../../DB/model/user.model.js";
import cloudinary from "../../services/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/email.js";

export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "email already exist!" });
  }
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/users`,
    }
  );
  const token = jwt.sign({ email }, process.env.CONFIRM_EMAIL_SECRET, {
    expiresIn: "1h",
  });
  sendEmail(
    email,
    "Confirm Your Email",
    `Click here to <a href='http://localhost:5050/auth/confirmEmail/${token}'>Verify Email</a>`
  );

  const createUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    image: { public_id, secure_url },
  });
  return res.json({ message: "success", createUser });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "data Invalid" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "data Invalid" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGIN_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGIN_SECRET,
    { expiresIn: 60 * 60 * 24 * 30 }
  );

  return res.status(200).json({ message: "success", token, refreshToken });
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const decode = jwt.verify(token, process.env.CONFIRM_EMAIL_SECRET);
  if (!decode) {
    return res.status(404).json({ message: "Invalid token" });
  }
  const user = await userModel.findOneAndUpdate(
    { email: decode.email, confirmEmail: false },
    { confirmEmail: true }
  );
  if (!user) {
    return res.status(400).json({ message: "Invalid verifying email or your email is already verified" });
  }
  return res.status(200).json({ message: "Your email is verified" });
};
