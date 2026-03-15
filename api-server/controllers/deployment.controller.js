import dotenv from "dotenv";
dotenv.config();
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/prima.js";

const ecsClient = new ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
});

const deployProject = asyncHandler(async (req, res) => {
    const { githubUrl, pathToPackageJson } = req.body;
    const { projectId } = req.params;

    const deployment = await prisma.deployment.create({
        data: {
            projectId,
            githubUrl,
        },
    });

    const command = new RunTaskCommand({
        cluster: process.env.ECS_CLUSTER_NAME,
        taskDefinition: process.env.ECS_TASK_DEFINITION,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                    process.env.SUBNET_ID_1,
                    process.env.SUBNET_ID_2,
                    process.env.SUBNET_ID_3,
                ],
                // securityGroups: ['']
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: process.env.CONTAINER_NAME,
                    environment: [
                        { name: "GITHUB_REPO_URL", value: githubUrl },
                        { name: "PROJECT_ID", value: projectId },
                        { name: "PATH_", value: pathToPackageJson || "" },
                        { name: "DEPLOYMENT_ID", value: deployment.id || "" },
                    ],
                },
            ],
        },
    });

    await ecsClient.send(command);

    const project = await prisma.deployment.findUnique({
        where: {
            projectId,
        },
    });

    return res.json({
        status: "queued",
        data: {
            projectId,
            url: `http://${project.subdomain}.localhost:6001`,
        },
    });
});

const getDeploymentsForProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const deployments = await prisma.deployment.findMany({
        where: {
            projectId: projectId,
        },
    });

    return res.json({ status: "success", data: { deployments } });
});

export { deployProject, getDeploymentsForProject };
