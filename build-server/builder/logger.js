import { DEPLOYMENT_ID, WEBHOOK_SECRET, API_SERVER_HOST } from "./constants.js";

let logsBuffer = [];
let timer = null;

export const logger = {
    log(message) {
        const msgStr = message.toString();
        logsBuffer.push(msgStr);
        console.log(msgStr);
    },

    error(message) {
        const msgStr = message.toString();
        logsBuffer.push(`[STDERR]: ${msgStr}`);
        console.error("Std Err -->", msgStr);
    },

    async flush(status = "ongoing") {
        if (logsBuffer.length === 0) return;

        const payload = {
            logs: [...logsBuffer],
            logsStatus: status,
            deploymentId: DEPLOYMENT_ID,
            webhookSecret: WEBHOOK_SECRET,
        };

        logsBuffer = [];

        try {
            await fetch(`${API_SERVER_HOST}/api/v1/logs/webhook/${DEPLOYMENT_ID}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("Failed to send logs to webhook:", err.message);
        }
    },

    startInterval() {
        if (timer) return;
        timer = setInterval(() => {
            this.flush("ongoing");
        }, 2500);
    },

    stopInterval() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
};
