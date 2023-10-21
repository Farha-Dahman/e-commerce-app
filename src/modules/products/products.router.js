import {Router} from 'express';
import * as productsRouter from "./products.controller.js";
const router = Router();

router.get('/', productsRouter.getProducts);

export default router;