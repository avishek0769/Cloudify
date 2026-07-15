import { runCommand } from "../utils/runCommand.js";

export async function buildProject(projectDir, packageManager) {
    const command = packageManager;
    const args = ["run", "build"];

    await runCommand(command, args, { cwd: projectDir });
}
