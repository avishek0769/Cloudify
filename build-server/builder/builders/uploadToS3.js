import fs from "fs";
import path from "path";
import mime from "mime-types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { walkDirectory } from "../utils/walkDirectory.js";
import { logger } from "../logger.js";
import { PROJECT_ID, AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET, S3_BUCKET } from "../constants.js";

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_ACCESS_KEY_SECRET,
    },
});

export async function uploadToS3(distPath) {
    if (!fs.existsSync(distPath)) {
        throw new Error(`Output directory not found at ${distPath}`);
    }

    const files = walkDirectory(distPath);

    for (const absolutePath of files) {
        const stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) continue;

        const relativePath = path.relative(distPath, absolutePath);
        // Normalize backslashes to forward slashes for S3 Object Key naming standard
        const s3KeyPath = relativePath.split(path.sep).join("/");
        const key = `__outputs/${PROJECT_ID}/${s3KeyPath}`;

        logger.log(`Uploading asset: ${s3KeyPath}`);

        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: fs.createReadStream(absolutePath),
            ContentType: mime.lookup(absolutePath) || "application/octet-stream",
        });

        await s3.send(command);
    }
}
