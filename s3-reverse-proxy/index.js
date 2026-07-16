import "dotenv/config";
import httpProxy from "http-proxy";
import express from "express";
import path from "path";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { prisma } from "../api-server/utils/prisma.js";

const PORT = 7002;
const BASE_PATH = process.env.BASE_PATH;
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_PREFIX = process.env.BUCKET_PREFIX;
const app = express();

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
});

async function deploymentExistsInS3(projectId) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: `${BUCKET_PREFIX}/${projectId}/`,
            MaxKeys: 1,
        });
        const response = await s3.send(command);
        return (response.KeyCount ?? 0) > 0;
    } catch {
        return false;
    }
}

function noDeploymentHtml(projectName, dashboardUrl) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>No Deployment Found — Cloudify</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #e5e5e5;
      padding: 24px;
    }

    .card {
      background: #111111;
      border: 1px solid #222222;
      border-radius: 16px;
      padding: 56px 48px;
      max-width: 520px;
      width: 100%;
      text-align: center;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6);
    }

    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 28px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }

    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #888;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 20px;
      padding: 4px 12px;
      margin-bottom: 20px;
      font-family: "SF Mono", "Fira Code", monospace;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #f5f5f5;
      margin-bottom: 12px;
      line-height: 1.3;
    }

    .project-name {
      color: #fff;
      font-style: normal;
    }

    p {
      font-size: 15px;
      line-height: 1.65;
      color: #888;
      margin-bottom: 32px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      color: #0a0a0a;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 8px;
      transition: opacity 0.15s ease, transform 0.15s ease;
    }

    .btn:hover {
      opacity: 0.88;
      transform: translateY(-1px);
    }

    .btn svg {
      flex-shrink: 0;
    }

    .footer {
      margin-top: 36px;
      padding-top: 24px;
      border-top: 1px solid #1e1e1e;
      font-size: 12px;
      color: #555;
      font-family: "SF Mono", "Fira Code", monospace;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🚀</div>
    <span class="badge">No Deployment</span>
    <h1>This project hasn't been deployed yet</h1>
    <p>
      <em class="project-name">${projectName}</em> exists, but no build has been
      pushed to this URL yet. Head to your Cloudify dashboard, open this project,
      and trigger your first deployment to go live.
    </p>
    <a href="${dashboardUrl}" class="btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
      Create a Deployment
    </a>
    <div class="footer">cloudify &nbsp;·&nbsp; powered by Cloudify Platform</div>
  </div>
</body>
</html>`;
}

const proxy = httpProxy.createProxy({});

app.use(async (req, res, next) => {
    const hostname = req.hostname;
    let project = null;

    if (hostname.includes(process.env.BASE_DOMAIN)) {
        const subdomain = hostname.split(".")[0];
        project = await prisma.project.findUnique({
            where: { subdomain },
        });
    } else {
        project = await prisma.project.findUnique({
            where: { customDomain: hostname },
        });
    }

    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    const hasDeployment = await deploymentExistsInS3(project.id);

    if (!hasDeployment) {
        const dashboardUrl = `https://${process.env.BASE_DOMAIN}/projects/${project.id}/deployments`;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(noDeploymentHtml(project.name, dashboardUrl));
    }

    const resolveTo = `${BASE_PATH}/${project.id}`;
    req.projectId = project.id;

    proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req) => {
    const urlPath = req.url;
    const pathname = urlPath.split("?")[0];
    const extension = path.extname(pathname);

    let targetPath = "";

    if (pathname === "/" || pathname === "") {
        targetPath = `/${BUCKET_NAME}/${BUCKET_PREFIX}/${req.projectId}/index.html`;
    } else if (!extension) {
        targetPath = `/${BUCKET_NAME}/${BUCKET_PREFIX}/${req.projectId}/index.html`;
    } else {
        targetPath = `/${BUCKET_NAME}/${BUCKET_PREFIX}/${req.projectId}${pathname}`;
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