import { Router } from "express";
import { deployProject, getDeploymentsForProject, fetchDeploymentDetails } from "../controllers/deployment.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const deploymentRouter = Router();

deploymentRouter.post("/create/:projectId", verifyStrictJWT, deployProject);
deploymentRouter.get("/all/:projectId", verifyStrictJWT, getDeploymentsForProject);
deploymentRouter.get("/details/:deploymentId", verifyStrictJWT, fetchDeploymentDetails);

export default deploymentRouter;
