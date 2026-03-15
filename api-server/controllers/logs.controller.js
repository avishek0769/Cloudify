import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/prima.js";

let LOGS = {};

const logsWebhook = asyncHandler(async (req, res) => {
    const { deploymentId } = req.params;
    const { logs, logsStatus, webhookSecret } = req.body;

    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Log --> ", logs);

    if (!LOGS[deploymentId]) {
        LOGS[deploymentId] = { status: "", logs: [] };
    }

    LOGS[deploymentId].logs.push(...logs);
    LOGS[deploymentId].status = logsStatus;

    await prisma.log_Events.createMany({
        data: logs.map((log) => ({
            log,
            deploymentId: deploymentId,
        })),
    });

    return res.send("Got");
});

const fetchLogsPolling = asyncHandler(async (req, res) => {
    const { deploymentId } = req.params;

    if (!LOGS[deploymentId]) {
        return res.json({ error: "Logs for this project does not exists" });
    }

    const logsChunk = LOGS[deploymentId].logs;
    const logsStatus = LOGS[deploymentId].status;

    LOGS[deploymentId].logs = [];

    if (logsStatus == "end") {
        delete LOGS[deploymentId];
    }

    return res.json({
        status: "success",
        data: { logs: logsChunk, logsStatus },
    });
});

const fetchAllLogs = asyncHandler(async (req, res) => {
    const { deploymentId } = req.params;

    const logs = await prisma.log_Events.findMany({
        where: {
            deploymentId: deploymentId,
        },
    });

    if (!logs) {
        return res.json({
            status: "error",
            error: "Logs for this project does not exists",
        });
    }

    return res.json({ status: "success", data: { logs } });
});

export { logsWebhook, fetchLogsPolling, fetchAllLogs };
