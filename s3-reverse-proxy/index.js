import httpProxy from "http-proxy";
import express from "express";
import path from "path";
import { prisma } from "../api-server/utils/prisma.js";

const PORT = 7002;
const BASE_PATH = "https://s3.ap-south-1.amazonaws.com/vercel.output/__outputs";
const app = express();

const proxy = httpProxy.createProxy({});

app.use(async (req, res, next) => {
    const hostname = req.hostname;
    let project = null;
    
    if(hostname.includes("cloudify.avishekadhikary.tech")) {
        project = await prisma.project.findUnique({
            where: { customDomain: hostname },
        });
    }
    else {
        const subdomain = hostname.split(".")[0];
        project = await prisma.project.findUnique({
            where: { subdomain },
        });
    }

    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    const resolveTo = `${BASE_PATH}/${project.id}`;
    req.projectId = project.id;

    proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
    const urlPath = req.url;
    
    const pathname = urlPath.split("?")[0];
    const extension = path.extname(pathname);

    let targetPath = "";

    if (pathname === "/" || pathname === "") {
        targetPath = `/vercel.output/__outputs/${req.projectId}/index.html`;
    } else if (!extension) {
        targetPath = `/vercel.output/__outputs/${req.projectId}/index.html`;
    } else {
        targetPath = `/vercel.output/__outputs/${req.projectId}${pathname}`;
    }

    const queryIndex = urlPath.indexOf("?");
    if (queryIndex !== -1) {
        targetPath += urlPath.substring(queryIndex);
    }

    proxyReq.path = targetPath;
});

proxy.on("error", (err, req, res) => {
    console.error("Proxy Error:", err);
    if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "application/json" });
    }
    res.end(JSON.stringify({ error: "Proxy connection failed." }));
});

app.listen(PORT, () => console.log(`Proxy server running on ${PORT}...`));