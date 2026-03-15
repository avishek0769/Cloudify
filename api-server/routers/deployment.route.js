import { Router } from "express";
import { deployProject } from "../controllers/deployment.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const deploymentRouter = Router();

deploymentRouter.post("/:projectId", verifyStrictJWT, deployProject);

export default deploymentRouter;
