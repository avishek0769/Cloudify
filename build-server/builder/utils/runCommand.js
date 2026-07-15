import { spawn } from "child_process";
import { logger } from "../logger.js";
import { TIMEOUT_MS } from "../constants.js";

export function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        logger.log(`Running command: ${command} ${args.join(" ")}`);

        const child = spawn(command, args, {
            ...options,
            shell: true,
        });

        let timedOut = false;
        const timeoutTimer = setTimeout(() => {
            timedOut = true;
            child.kill("SIGKILL");
            reject(new Error(`Build timed out after ${TIMEOUT_MS / 60000} minutes.`));
        }, TIMEOUT_MS);

        child.stdout.on("data", (data) => {
            if (timedOut) return;
            logger.log(data.toString());
        });

        child.stderr.on("data", (data) => {
            if (timedOut) return;
            logger.error(data.toString());
        });

        child.on("error", (err) => {
            clearTimeout(timeoutTimer);
            reject(err);
        });

        child.on("close", (code) => {
            clearTimeout(timeoutTimer);
            if (timedOut) return;

            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}
