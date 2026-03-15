import dotenv from "dotenv";
dotenv.config();
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { asyncHandler } from "../utils/asyncHandler.js";

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
                    ],
                },
            ],
        },
    });

    await ecsClient.send(command);

    return res.json({
        status: "queued",
        data: {
            projectId,
            url: `http://${projectId}.localhost:6001`,
        },
    });
});

export { deployProject };
