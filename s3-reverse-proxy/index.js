import httpProxy from "http-proxy";
import express from "express";
import { prisma } from "../api-server/utils/prisma.js";

const PORT = 6001;
const BASE_PATH = "https://s3.ap-south-1.amazonaws.com/vercel.output/__outputs";
const app = express();

const proxy = httpProxy.createProxy({});

app.use(async (req, res, next) => {
    const hostname = req.hostname;
    const subdomain = hostname.split(".")[0];

    const project = await prisma.project.findUnique({
        where: {
            subdomain: subdomain,
        },
    });

    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    const resolveTo = `${BASE_PATH}/${project.id}`;

    proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
    if (req.url == "/") proxyReq.path += "index.html";
    console.log(proxyReq.path);
});

app.listen(PORT, () => console.log(`Proxy server running on ${PORT}...`));
