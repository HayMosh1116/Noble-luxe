import { Router } from "express";
import healthRouter from "./health.js";
import storeRouter from "./store.js";

const router = Router();

router.use(healthRouter);
router.use(storeRouter);

export default router;