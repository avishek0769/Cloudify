import httpProxy from "http-proxy";
import express from "express";

const PORT = 6001;
const BASE_PATH = "https://s3.ap-south-1.amazonaws.com/vercel.output/__outputs";
const app = express();

const proxy = httpProxy.createProxy({ });

app.use((req, res, next) => {
    const hostname = req.hostname;
    const projectId = hostname.split(".")[0]
    const resolveTo = `${BASE_PATH}/${projectId}`

    proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
    if (req.url == "/") proxyReq.path += "index.html";
    console.log(proxyReq.path)
});

app.listen(PORT, () => console.log(`Proxy server running on ${PORT}...`));
