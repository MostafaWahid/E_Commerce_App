import { Router } from "express";
import { createCheckout } from "./checkout.controller";

const router = Router();

router.post("/", createCheckout);

export default router;