import { Router } from "express";
import { fetchLogsPolling, logsWebhook } from "../controllers/logs.controller.js";

const logsRouter = Router();

logsRouter.post("/webhook/:projectId", logsWebhook);
logsRouter.get("/:projectId", fetchLogsPolling);

export default logsRouter;
