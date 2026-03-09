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
const PATH_TO_PACKAGE_JSON = process.env.PATH_

console.log("Starting building...");

const outputDir = path.join(import.meta.dirname, "output", PATH_TO_PACKAGE_JSON || "");
const p = exec(
    `cd ${outputDir} && npm install --legacy-peer-deps && npm run build`,
);

p.stderr.on("data", (chunk) => {
    console.log("Std Err --> ", chunk.toString());
});

p.stdout.on("data", (chunk) => {
    console.log(chunk.toString());
});

p.stdout.on("error", (error) => {
    console.log("Error --> ", error.toString());
});

p.stdout.on("close", async () => {
    console.log("Build complete");
    const distPath = path.join(import.meta.dirname, "output", PATH_TO_PACKAGE_JSON || "", "dist");
    const files = fs.readdirSync(distPath, { recursive: true });

    for (const file of files) {
        console.log("File --> ", file, mime.lookup(file));
        const filePath = path.join(distPath, file);
        const isDir = fs.lstatSync(filePath).isDirectory();

        if (!isDir) {
            const command = new PutObjectCommand({
                Bucket: "vercel.output",
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath),
            });

            await s3.send(command);
            console.log("Upload complete");
        }
    }
});
