import { Router } from "express";
import {
	createProject,
	projectSlugAvailable,
	getProjectsByUser,
	getProjectById,
	verifyDns,
	updateProjectCustomDomain,
	deleteProject,
} from "../controllers/project.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

projectRouter.post("/create", verifyStrictJWT, createProject);
projectRouter.post("/verify-dns", verifyStrictJWT, verifyDns);
projectRouter.get("/slug/:slug", verifyStrictJWT, projectSlugAvailable);
projectRouter.get("/all", verifyStrictJWT, getProjectsByUser);
projectRouter.patch("/:projectId/domain", verifyStrictJWT, updateProjectCustomDomain);
projectRouter.get("/:projectId", verifyStrictJWT, getProjectById);
projectRouter.delete("/:projectId", verifyStrictJWT, deleteProject);

export default projectRouter;
