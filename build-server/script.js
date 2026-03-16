import dotenv from "dotenv";
dotenv.config();
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
});

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const PATH_TO_PACKAGE_JSON = process.env.PATH_ || "";
// const API_SERVER_HOST = "https://r51klsgs-6000.inc1.devtunnels.ms";
const API_SERVER_HOST = "https://vercel.avishekadhikary.tech";

let logsBuffer = [];
let timer;

async function sendLogs(status = "ongoing") {
    if (logsBuffer.length === 0) return;

    const payload = {
        logs: logsBuffer,
        logsStatus: status,
        deploymentId: DEPLOYMENT_ID,
        webhookSecret: WEBHOOK_SECRET,
    };

    logsBuffer = [];

    try {
        await fetch(`${API_SERVER_HOST}/api/v1/logs/webhook/${DEPLOYMENT_ID}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(payload),
        });
    }
    catch (err) {
        console.error("Failed to send logs to webhook:", err.message);
    }
}

const buildAndUpload = async () => {
    timer = setInterval(() => sendLogs("ongoing"), 2500);

    try {
        const outputDir = path.join(
            import.meta.dirname,
            "output",
            PATH_TO_PACKAGE_JSON,
        );

        console.log("Starting building...");
        logsBuffer.push("Build started...");

        await new Promise((resolve, reject) => {
            const p = exec(
                `cd ${outputDir} && npm install --legacy-peer-deps && npm run build`,
            );

            p.stdout.on("data", (data) => {
                logsBuffer.push(data.toString());
                console.log(data.toString());
            });

            p.stderr.on("data", (data) => {
                logsBuffer.push(`[STDERR]: ${data.toString()}`);
                console.log("Std Err --> ", data.toString());
            });

            p.on("close", (code) => {
                if (code === 0) {
                    resolve()
                }
                else reject(new Error(`Build failed with exit code ${code}`));
            });
        });

        console.log("Build complete. Starting S3 Upload...");
        logsBuffer.push("Build successful. Syncing to S3...");

        const distPath = path.join(outputDir, "dist");

        if (!fs.existsSync(distPath)) {
            throw new Error(`Dist directory not found at ${distPath}`);
        }

        const files = fs.readdirSync(distPath, { recursive: true });

        for (const file of files) {
            const filePath = path.join(distPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log("Uploading --> ", file);
            logsBuffer.push(`Uploading ${file}...`);

            const command = new PutObjectCommand({
                Bucket: "vercel.output",
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) || "application/octet-stream",
            });

            await s3.send(command);
        }

        logsBuffer.push("Build process completed successfully.");
        clearInterval(timer);
        await sendLogs("end");
        process.exit(0);
    }
    catch (error) {
        console.error("Process Error:", error.message);
        logsBuffer.push(`FATAL ERROR: ${error.message}`);

        clearInterval(timer);
        await sendLogs("error");
        process.exit(1);
    }
};

buildAndUpload();
