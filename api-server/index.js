import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const app = express();
const PORT = 6000;
let LOGS = {};

const ecsClient = new ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
});

app.use(express.json());

app.post("/deploy", async (req, res) => {
    const { githubUrl, projectId, pathToPackageJson } = req.body;

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

app.post("/webhook/logs/:projectId", (req, res) => {
    const { projectId } = req.params;
    const { logs, logsStatus } = req.body;
    console.log("Log --> ", logs);

    if (!LOGS[projectId]) {
        LOGS[projectId] = { status: "", logs: [] };
    }

    LOGS[projectId].logs.push(...logs);  // TODO: Store to DB
    LOGS[projectId].status = logsStatus;

    return res.send("Got");
});

app.get("/logs/:projectId", (req, res) => {
    const { projectId } = req.params;

    if (!LOGS[projectId]) {
        return res.json({ error: "Logs for this project does not exists" });
    }

    const logsChunk = LOGS[projectId].logs;
    const logsStatus = LOGS[projectId].status;

    LOGS[projectId].logs = [];

    if (logsStatus == "end") {
        delete LOGS[projectId];
    }

    return res.json({ logs: logsChunk, logsStatus });
});

app.listen(6000, () => console.log(`API Server running on ${PORT}...`));
