import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import storeRouter from "./store.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storeRouter);

export default router;
