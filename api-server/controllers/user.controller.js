import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await prisma.user.create({
        data: { fullname, email, password, refreshToken: "" },
    });

    const accessToken = jwt.sign(
        { userId: newUser.id, fullname },
        process.env.JWT_SECRET,
        { expiresIn: "3d" },
    );
    const refreshToken = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    await prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken },
    });

    return res
        .status(201)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
            message: "User registered successfully",
            accessToken,
            refreshToken,
        });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: "Invalid email" });
    }
    if (user.password !== password) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { userId: user.id, fullname: user.fullname },
        process.env.JWT_SECRET,
        { expiresIn: "3d" },
    );
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        .json({ message: "Login successful", user });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, fullname: true, email: true },
    });
    return res.json({ user });
});

export { registerUser, loginUser, getUserProfile };
