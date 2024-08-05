
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from 'cloudinary';

import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { userModel } from "../../user/models/user.model.js";
import { sendEmailVerfication } from "../../../utilies/email.js";
import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { removeFile } from "../../../utilies/removeFile.js";

dotenv.config()


export const signIn = catchAsyncError(async (req, res, next) => {
    const { identifier, password } = req.body;
    const user = await userModel.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new AppError('Invalid cardinat ...', 401)
    }
    const { firstName, email, userName, role, lastName, recoveryEmail, email_verified, status, DOB, mobileNumber, _id } = user

    const token = jwt.sign({ userName, email, role, firstName, lastName, recoveryEmail, email_verified, status, DOB, mobileNumber, _id }, process.env.SECRET_KEY)
    user.status = 'online'
    user.isDeleted = false
    user.isLoggedOut = false
    await user.save();
    res.status(200).json({ Message: "Signed in successfully", token, _id })
})

export const signUp = catchAsyncError(async (req, res, next) => {

    const { email, password, firstName, lastName, recoveryEmail, userName, DOB, mobileNumber } = req.body
    let { filename: profilePicture } = req.file
    req.body.profilePicture = profilePicture

    const email_token = jwt.sign({ email }, process.env.EMAIL_SECRET_KEY)

    const link = process.env.BASE_URL + `api/v1/auth/confirmEmail/${email_token}`
    await sendEmailVerfication(email, { link })
    const hashedPassword = bcrypt.hashSync(password, +process.env.hash_pass_num)
    let cloud = await cloudinary.uploader.upload(req.file.path)
    await removeFile(req.file.path)
    const user = await userModel.create({ profilePicture: cloud.secure_url, email, userName, password: hashedPassword, firstName, lastName, recoveryEmail, DOB, mobileNumber })

    res.status(201).json({ status: "success", message: "User is signedUp ✔", user })

})

export const confirm_email = catchAsyncError(async (req, res, next) => {
    try {
        const { token } = req.params;
        const { email } = jwt.verify(token, process.env.EMAIL_SECRET_KEY)


        await userModel.findOneAndUpdate({ email }, { email_verified: true })
        res.status(200).send("Email is verified")
    } catch (error) {
        throw new AppError(error.message, 498)
    }
})



