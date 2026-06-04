import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signupController = asyncHandler(async (req, res) => {
    const {
        fullName,
        email,
        phone,
        password,
        role
    } = req.body;

    await authService.signup({
        fullName,
        email,
        phone,
        password,
        role
    });

    res.status(201).json({
        success: true,
        message: "Signup successful."
    });
});

export const loginController = asyncHandler(async (req, res) => {
    const { credential, password } = req.body;

    const { user } = await authService.login({
        credential,
        password
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        user,
    });
});

export const googleController = asyncHandler(async (req, res) => {

    const { id, displayName, emails } = req.user
    const email = emails[0].value;

    let user = await userModel.findOne({
        email
    })

    if (!user) {
        user = await userModel.create({
            email,
            googleId: id,
            fullname: displayName,
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.redirect(config.CLIENT_URL)
});

export const getUserController = asyncHandler(async (req, res) => {

    const user = await authService.getUser(req.user._id);
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        user,
    });
});

export const logoutController = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});