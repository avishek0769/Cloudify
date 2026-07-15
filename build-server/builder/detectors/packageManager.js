import fs from "fs";
import path from "path";

export function detectPackageManager(projectDir) {
    if (fs.existsSync(path.join(projectDir, "bun.lockb")) || fs.existsSync(path.join(projectDir, "bun.lock"))) {
        return "bun";
    }
    if (fs.existsSync(path.join(projectDir, "pnpm-lock.yaml"))) {
        return "pnpm";
    }
    if (fs.existsSync(path.join(projectDir, "yarn.lock"))) {
        return "yarn";
    }
    if (fs.existsSync(path.join(projectDir, "package-lock.json"))) {
        return "npm";
    }
    return "npm"; // fallback
}
