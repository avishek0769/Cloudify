import fs from "fs";
import path from "path";
import { readPackageJson } from "../utils/readPackageJson.js";
import { detectPackageManager } from "./packageManager.js";
import { detectFramework } from "./framework.js";

export function validateProject(projectDir) {
    const pkgPath = path.join(projectDir, "package.json");
    if (!fs.existsSync(pkgPath)) {
        throw new Error("Validation Failed: package.json does not exist in the project directory.");
    }

    const pkg = readPackageJson(projectDir);

    if (!pkg.scripts || !pkg.scripts.build) {
        throw new Error("Validation Failed: No 'build' script found in package.json.");
    }

    const framework = detectFramework(projectDir);
    const pm = detectPackageManager(projectDir);

    return {
        packageManager: pm,
        framework: framework,
        packageJson: pkg
    };
}
