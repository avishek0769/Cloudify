import "dotenv/config";
import express from "express";
import logsRouter from "./routers/logs.route.js";
import projectRouter from "./routers/project.route.js";
import deployRouter from "./routers/deployment.route.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = 7000;

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.log(err)
    res.status(statusCode).json({ message });
};

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/v1/logs", logsRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/deployment", deployRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`API Server running on ${PORT}...`));
