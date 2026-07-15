import fs from "fs";
import path from "path";

export function detectOutputDirectory(projectDir) {
    const configFiles = [
        "vite.config.js",
        "vite.config.ts",
        "vite.config.mjs",
        "vite.config.cjs",
    ];

    for (const file of configFiles) {
        const configPath = path.join(projectDir, file);
        if (fs.existsSync(configPath)) {
            try {
                const content = fs.readFileSync(configPath, "utf-8");
                // Regex to find outDir configuration value: outDir: 'val' or outDir: "val" or outDir: `val`
                const match = content.match(/outDir\s*:\s*['"`]([^'"`]+)['"`]/);
                if (match && match[1]) {
                    return match[1].trim();
                }
            } catch (err) {
                // Ignore parsing errors and check other config formats or fallback
            }
        }
    }

    return "dist"; // Default fallback
}
