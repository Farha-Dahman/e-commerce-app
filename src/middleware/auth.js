import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.status(400).json({ message: "Invalid authorization!" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid authorization!" });
    }
    const user = await userModel
      .findById(decoded.id)
      .select("userName role changePasswordTime");
    if (!user) {
      return res.status(400).json({ message: "Not registered user" });
    }

    if (parseInt(user.changePasswordTime.getTime() / 1000) > decoded.iat) {
      return next(new Error(`expired token, plz login!`, { cause: 400 }));
    }
    if (!accessRoles.includes(user.role)) {
      return res.status(403).json({ message: "Not auth user!" });
    }
    req.user = user;
    next();
  };
};
