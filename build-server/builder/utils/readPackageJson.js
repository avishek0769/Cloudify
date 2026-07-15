import fs from "fs";
import path from "path";

export function readPackageJson(projectDir) {
    const pkgPath = path.join(projectDir, "package.json");
    if (!fs.existsSync(pkgPath)) {
        throw new Error(`package.json not found at ${pkgPath}`);
    }
    try {
        const content = fs.readFileSync(pkgPath, "utf-8");
        return JSON.parse(content);
    } catch (err) {
        throw new Error(`Failed to parse package.json: ${err.message}`);
    }
}
