import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dns from "dns/promises";
import fs from "fs/promises";
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const NGINX_CONF_DIR = "/etc/nginx/conf.d/custom-domains";
const UPSTREAM = "cloudify_s3_reverse_proxy";

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
});

const deleteS3Folder = async (projectId) => {
    const bucketName = process.env.S3_BUCKET || "vercel.output";
    const prefix = `__outputs/${projectId}/`;

    let continuationToken = undefined;

    do {
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
        });

        const listResponse = await s3Client.send(listCommand);
        const contents = listResponse.Contents || [];

        if (contents.length > 0) {
            const objectsToDelete = contents.map(item => ({ Key: item.Key }));

            const deleteCommand = new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                    Objects: objectsToDelete,
                    Quiet: true,
                },
            });

            await s3Client.send(deleteCommand);
        }

        continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);
};

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

    if(verified) {
        await generateSSL(customDomain);
    }

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
    const userId = req.user.id;

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

    await deleteS3Folder(projectId);

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

async function createNginxConfig(domain) {
    const confPath = `${NGINX_CONF_DIR}/${domain}.conf`;

    const config = `
server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass http://${UPSTREAM};

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;

    await fs.writeFile(confPath, config);
}

async function generateSSL(domain) {
    try {
        console.log(`Generating nginx config for ${domain}`);

        await createNginxConfig(domain);

        await execAsync("sudo nginx -t");
        await execAsync("sudo systemctl reload nginx");

        console.log(`Issuing SSL certificate for ${domain}`);

        await execAsync(
            `sudo certbot --nginx \
            -d ${domain} \
            --non-interactive \
            --agree-tos \
            --register-unsafely-without-email \
            --redirect`
        );

        await execAsync("sudo systemctl reload nginx");

        await prisma.project.update({
            where: {
                customDomain: domain,
            },
            data: {
                isVerified: true,
            },
        });

        console.log(`SSL generated successfully for ${domain}`);
    } catch (err) {
        console.error(`Failed to generate SSL for ${domain}`);

        console.error(err.stderr || err.stdout || err.message);

        // Remove broken nginx config if something failed
        try {
            await fs.unlink(`${NGINX_CONF_DIR}/${domain}.conf`);
            await execAsync("sudo nginx -t");
            await execAsync("sudo systemctl reload nginx");
        } catch {}

        throw err;
    }
}

setInterval(async () => {
    const projects = await prisma.project.findMany({
        where: {
            isVerified: false,
            customDomain: {
                not: null,
            },
        },
    });

    for (const project of projects) {
        try {
            console.log(`Checking ${project.customDomain}`);

            const records = await dns.resolveCname(project.customDomain);

            const verified = records.includes(
                `${project.subdomain}.${process.env.BASE_DOMAIN}`
            );

            if (!verified) {
                console.log(`${project.customDomain} DNS not propagated yet`);
                continue;
            }

            console.log(`${project.customDomain} verified`);

            await generateSSL(project.customDomain);
        } catch (err) {
            if (err.code !== "ENODATA" && err.code !== "ENOTFOUND") {
                console.error(err);
            }
        }
    }
}, 2 * 60 * 1000);