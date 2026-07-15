import path from "path";
import { logger } from "./logger.js";
import { PROJECT_ROOT_DIR } from "./constants.js";
import { validateProject } from "./detectors/validateProject.js";
import { detectOutputDirectory } from "./detectors/outputDirectory.js";
import { installDependencies } from "./builders/installDependencies.js";
import { buildProject } from "./builders/buildProject.js";
import { uploadToS3 } from "./builders/uploadToS3.js";

export async function buildAndUpload() {
    logger.startInterval();

    try {
        logger.log("Detecting project configuration...");

        // 1. Project Validation & Detection
        const config = validateProject(PROJECT_ROOT_DIR);

        logger.log(`Detected package manager: ${config.packageManager}`);
        logger.log(`Detected framework: ${config.framework}`);

        // 2. Install dependencies
        logger.log("Installing dependencies...");
        await installDependencies(PROJECT_ROOT_DIR, config.packageManager);

        // 3. Build project
        logger.log("Running build...");
        await buildProject(PROJECT_ROOT_DIR, config.packageManager);

        // 4. Output directory detection
        const relativeOutputDir = detectOutputDirectory(PROJECT_ROOT_DIR);
        const absoluteOutputDir = path.join(PROJECT_ROOT_DIR, relativeOutputDir);
        logger.log(`Detected output directory: ${relativeOutputDir}`);

        // 5. Upload to S3
        logger.log("Uploading assets...");
        await uploadToS3(absoluteOutputDir);

        logger.log("Deployment completed successfully.");

        logger.stopInterval();
        await logger.flush("end");
        process.exit(0);
    } catch (error) {
        logger.error(`FATAL ERROR: ${error.message}`);

        logger.stopInterval();
        await logger.flush("error");
        process.exit(1);
    }
}
