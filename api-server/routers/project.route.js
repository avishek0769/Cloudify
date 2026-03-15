import { Router } from "express";
import { createProject } from "../controllers/project.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

projectRouter.post("/create", verifyStrictJWT, createProject);
projectRouter.get("/slug/:slug", verifyStrictJWT, projectSlugAvailable);

export default projectRouter;
