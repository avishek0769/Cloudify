import { Router } from "express";
import { fetchLogsPolling, logsWebhook } from "../controllers/logs.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const logsRouter = Router();

logsRouter.post("/webhook/:deploymentId", verifyStrictJWT, logsWebhook);
logsRouter.get("/deployment/:deploymentId", verifyStrictJWT, fetchLogsPolling);

export default logsRouter;
