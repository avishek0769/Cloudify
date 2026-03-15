import dotenv from "dotenv";
dotenv.config();
import express from "express";
import logsRouter from "./routers/logs.route.js";
import projectRouter from "./routers/project.route.js";
import deployRouter from "./routers/deployment.route.js";

const app = express();
const PORT = 6000;

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
};

app.use(express.json());

app.use("/api/v1/project", projectRouter)
app.use("/api/v1/deploy", deployRouter);
app.use("/api/v1/logs", logsRouter);

app.use(errorHandler);

app.listen(6000, () => console.log(`API Server running on ${PORT}...`));
