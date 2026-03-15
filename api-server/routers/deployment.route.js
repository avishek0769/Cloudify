import { Router } from "express";
import { deployProject } from "../controllers/deployment.controller.js";

const deploymentRouter = Router();

deploymentRouter.post("/:projectId", deployProject);

export default deploymentRouter;
