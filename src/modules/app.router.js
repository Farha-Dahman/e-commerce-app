import connectionDB from "../../DB/connection.js";
import categoriesRouter from "./categories/categories.router.js";
import productsRouter from "./products/products.router.js";
import subcategoryRouter from "./subcategory/subcategory.router.js";
import couponRouter from "./coupon/coupon.router.js";
import authRouter from "./auth/auth.router.js";
import cartRouter from "./cart/cart.router.js";
import { globalErrorHandler } from "../services/errorHandling.js";

const initApp = (app, express) => {
  app.use(express.json());
  connectionDB();
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome" });
  });
  app.use("/auth", authRouter);
  app.use("/categories", categoriesRouter);
  app.use("/subcategory", subcategoryRouter);
  app.use("/products", productsRouter);
  app.use("/coupon", couponRouter);
  app.use("/cart", cartRouter);
  app.get("*", (req, res) => {
    return res.status(500).json({ message: "Page not found" });
  });
  app.use(globalErrorHandler);
};

export default initApp;
