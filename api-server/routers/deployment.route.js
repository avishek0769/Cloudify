import { Router } from "express";
import { deployProject, getDeploymentsForProject } from "../controllers/deployment.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const deploymentRouter = Router();

deploymentRouter.post("/create/:projectId", verifyStrictJWT, deployProject);
deploymentRouter.get("/all/:projectId", verifyStrictJWT, getDeploymentsForProject);

export default deploymentRouter;
