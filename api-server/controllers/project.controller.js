import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProject = asyncHandler(async (req, res) => {
    const { name, slug, githubUrl } = req.body;

    const project = await prisma.project.findUnique({
        where: {
            subdomain: slug,
        },
    });

    if (project) {
        return res
            .status(400)
            .json({
                status: "error",
                message: "Project slug is already taken",
            });
    }

    const newProject = await prisma.project.create({
        data: {
            name,
            subdomain: slug,
            githubUrl,
            userId: req.user.id,
        }
    });

    return res.json({ status: "success", data: { newProject } });
});

const projectSlugAvailable = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
        where: {
            subdomain: slug,
        },
    });

    return res.json({ status: "success", data: { available: !project } });
});

const getProjectsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const projects = await prisma.project.findMany({
        where: {
            userId: userId,
        },
    });

    return res.json({ status: "success", data: { projects } });
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });

    return res.json({ status: "success", data: { project } });
});

export { createProject, projectSlugAvailable, getProjectsByUser, getProjectById };
