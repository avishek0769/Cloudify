import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dns from "dns/promises"

const createProject = asyncHandler(async (req, res) => {
    const { name, slug, githubUrl, customDomain } = req.body;

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
            customDomain
        }
    });

    return res.json({ status: "success", data: { newProject } });
});

const verifyDns = asyncHandler(async (req, res) => {
    const { customDomain, subdomain } = req.body;

    if(!customDomain || !subdomain) {
        return res.status(400)
            .json({
                status: "error",
                message: "Custom domain and Subdomain are required fields",
            });
    }
    
    const project = await prisma.project.findUnique({
        where: { customDomain }
    });

    if (project) {
        return res
            .status(400)
            .json({
                status: "error",
                message: "This domain is already being used",
            });
    }

    const records = await dns.resolveCname(customDomain)
    const verified = records.includes(`${subdomain}.${process.env.BASE_DOMAIN}`);

    return res
        .status(200)
        .json({ verified })
})

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

const updateProjectCustomDomain = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { customDomain } = req.body;

    if (customDomain) {
        const existing = await prisma.project.findFirst({
            where: {
                customDomain,
                id: { not: projectId }
            }
        });
        if (existing) {
            return res.status(400).json({
                status: "error",
                message: "This domain is already in use by another project"
            });
        }
    }

    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { customDomain: customDomain || null }
    });

    return res.json({ status: "success", data: { project: updatedProject } });
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const deployments = await prisma.deployment.findMany({
        where: { projectId },
        select: { id: true }
    });
    const deploymentIds = deployments.map(d => d.id);

    await prisma.log_Events.deleteMany({
        where: { deploymentId: { in: deploymentIds } }
    });

    await prisma.deployment.deleteMany({
        where: { projectId }
    });

    await prisma.project.delete({
        where: { id: projectId }
    });

    return res.json({ status: "success", message: "Project deleted successfully" });
});

export {
    createProject,
    projectSlugAvailable,
    getProjectsByUser,
    getProjectById,
    verifyDns,
    updateProjectCustomDomain,
    deleteProject
};
