import { Router } from "express";
import {
	createProject,
	projectSlugAvailable,
	getProjectsByUser,
	getProjectById,
} from "../controllers/project.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

projectRouter.post("/create", verifyStrictJWT, createProject);
projectRouter.get("/slug/:slug", verifyStrictJWT, projectSlugAvailable);
projectRouter.get("/all/:userId", verifyStrictJWT, getProjectsByUser);
projectRouter.get("/:projectId", verifyStrictJWT, getProjectById);

export default projectRouter;
