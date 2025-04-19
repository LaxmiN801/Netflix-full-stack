import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async(req, res) =>{
    const {username, email, password} = req.body;
    if([username, email, password].some((field)=> field?.trim() === "")){
        throw new ApiError(409, "all fields are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        throw new ApiError(408, "invalid email")
    }

    const exitUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (exitUser) {
        throw new ApiError(408, "username or email already exit")
    }

    if (password.length < 6) {
		throw new ApiError(408, "Password must be at least 6 characters")	
		}

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

	const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const user = await User.create({
        username,
        email,
		password,
		image,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong on server side")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: createdUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(401, "fill the requird fields")
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new ApiError(401, "invalid email")
    }

    const isPasswordvalid = await user.isPasswordCorrect(password)
    if (!isPasswordvalid) {
        throw new ApiError(401, "incorrect password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken ||req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(401, "invalid refreshToken")
    }

    const {accessToken, refreshToken} = generateAccessAndRefereshTokens(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(
            201,
            {accessToken, refreshToken},
            "accessToken refreshed"
        )
    )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}