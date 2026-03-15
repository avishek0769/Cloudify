import { Router } from "express";
import { fetchLogsPolling, logsWebhook } from "../controllers/logs.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const logsRouter = Router();

logsRouter.post("/webhook/:projectId", verifyStrictJWT, logsWebhook);
logsRouter.get("/:projectId", verifyStrictJWT, fetchLogsPolling);

export default logsRouter;
