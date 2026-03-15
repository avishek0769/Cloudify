import { Router } from "express";
import { fetchAllLogs, fetchLogsPolling, logsWebhook } from "../controllers/logs.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const logsRouter = Router();

logsRouter.post("/webhook/:deploymentId", logsWebhook);
logsRouter.get("/deployment/:deploymentId", verifyStrictJWT, fetchLogsPolling);
logsRouter.get("/deployment/all/:deploymentId", verifyStrictJWT, fetchAllLogs);

export default logsRouter;
