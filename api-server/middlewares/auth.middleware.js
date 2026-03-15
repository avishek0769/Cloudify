import jwt from "jsonwebtoken";
import { prisma } from "../utils/prima.js";

const verifyStrictJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("Access Token is required");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken._id,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) throw new Error("Invalid Access Token");

        req.user = user;
        next();
    }
    catch (error) {
        next(new Error("Your Access Token expired !"));
    }
};

const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken._id,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (user) req.user = user;
    }
    next();
};

export { verifyStrictJWT, verifyJWT };
