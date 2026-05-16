import { Router } from "express";
import {
  createAdminProduct,
  deleteAdminProduct,
  getImageKitAuth,
  listAdminProducts,
  requireAdmin,
  updateAdminProduct,
} from "./admin.controller";

const router = Router();

router.use(requireAdmin);
//TODO:i want to add seller type not just admin and every seller has it's own schema so he see it's product that he sell and add product and edit just the product that realted to him and invoices and reports for each seller 
router.get("/imagekit/auth", getImageKitAuth);
router.get("/products", listAdminProducts);
router.post("/products", createAdminProduct);
router.patch("/products/:id", updateAdminProduct);
router.delete("/products/:id", deleteAdminProduct);

export default router;