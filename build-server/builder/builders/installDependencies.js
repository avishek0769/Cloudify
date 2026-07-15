import { runCommand } from "../utils/runCommand.js";

export async function installDependencies(projectDir, packageManager) {
    const command = packageManager;
    let args = ["install"];

    if (packageManager === "npm") {
        args.push("--legacy-peer-deps");
    }

    await runCommand(command, args, { cwd: projectDir });
}
