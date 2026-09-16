import { Router } from "express";

const router = Router();

router.get(["/health", "/healthz"], (_req: any, res: any) => {
  res.json({
    status: "ok",
  });
});

export default router;
