import { asyncHandler } from "../utils/asyncHandler.js";

let LOGS = {};

const logsWebhook = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { logs, logsStatus } = req.body;
    console.log("Log --> ", logs);

    if (!LOGS[projectId]) {
        LOGS[projectId] = { status: "", logs: [] };
    }

    LOGS[projectId].logs.push(...logs); // TODO: Store to DB
    LOGS[projectId].status = logsStatus;

    return res.send("Got");
});

const fetchLogsPolling = asyncHandler(async (req, res) => {
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

export { logsWebhook, fetchLogsPolling };
