import { clerkClient } from "@clerk/express";
import { prisma } from "../utils/prisma.js";

const verifyStrictJWT = async (req, res, next) => {
    try {
        const clerkId = req.auth().userId;

        if (!clerkId) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Check if user exists in database
        let user = await prisma.user.findUnique({
            where: { clerkId },
            select: {
                id: true,
                email: true,
                fullname: true,
            },
        });

        // Automatically create user in database if they don't exist
        if (!user) {
            try {
                const clerkUser = await clerkClient.users.getUser(clerkId);
                const email = clerkUser.emailAddresses[0]?.emailAddress || "";
                const fullname = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";

                user = await prisma.user.create({
                    data: {
                        clerkId,
                        email,
                        fullname,
                    },
                    select: {
                        id: true,
                        email: true,
                        fullname: true,
                    }
                });
            } catch (err) {
                console.error("Failed to automatically sync Clerk user to DB:", err);
                return res.status(500).json({ message: "Failed to sync user profile" });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Clerk auth error:", error);
        next(new Error("Authentication failed"));
    }
};

const verifyJWT = verifyStrictJWT;

export { verifyStrictJWT, verifyJWT };
