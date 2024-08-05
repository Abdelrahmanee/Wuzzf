

import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';

import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { userModel } from "../models/user.model.js";
import { generateOTP, sendEmailVerfication } from '../../../utilies/email.js';
import { removeFile } from '../../../utilies/removeFile.js';



// update account.
export const updateAccount = catchAsyncError(async (req, res, next) => {

    const { _id } = req.user
    if (!_id) { return next(new AppError('User not found', 404)) };

    const updateData = req.body;

    const user = await userModel.findOne({ $or: [{ email: updateData.email }, { mobileNumber: updateData.mobileNumber }] })
    if (user) throw new AppError('try another email or mobileNumber', 400)

    if (req.file) {
        let cloud = await cloudinary.uploader.upload(req.file.path)
        await removeFile(req.file.path)
        updateData.profilePicture = cloud.secure_url
    }
    const userAfterUpdate = await userModel.findByIdAndUpdate(_id, updateData, { new: true })
    res.status(200).json({ Message: "Account updated successfully", userAfterUpdate })
})
export const updateAccountEmail = catchAsyncError(async (req, res, next) => {
    const { _id: userId , email:userEmail } = req.user
    const { email } = req.body
    
    if (!userId) { return next(new AppError('User not found', 404)) };
    if (email === userEmail) { return next(new AppError("you can't update your email to your current email", 409)) };
    const isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) { return next(new AppError('try another email', 409)) };

    const email_token = jwt.sign({ email }, process.env.EMAIL_SECRET_KEY)
    const link = process.env.BASE_URL + `api/v1/auth/confirmEmail/${email_token}`
    await sendEmailVerfication(email, { link })
    req.user.email = email
    req.user.status = "offline"
    req.user.email_verified = false
    req.user.isLoggedOut = true
    await req.user.save()
    res.status(200).json({
        status: "success",
        message: "user email updated please login again",
        date: req.user
    })
})

// Delete account

export const deleteAccount = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user
    if (!_id) { return next(new AppError('User not found', 404)) };

    await userModel.findByIdAndDelete(_id)
    res.status(200).json({ Message: "Account is deleted " })
})

// Get user account data 
export const userInfo = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user
    if (!_id) { return next(new AppError('User not found', 404)) };
    const user = await userModel.findById(_id)
    res.status(200).json({ user })
})

// Get profile data for another user 

export const anotherUserInfo = catchAsyncError(async (req, res, next) => {
    const { id: friend_id } = req.params;
    if (!friend_id) { return next(new AppError('User not found', 404)) };

    const user = await userModel.findById(friend_id, 'userName email age status')
    res.status(200).json({ user })
})

//  Update password 
export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;
    if (!_id) { return next(new AppError('User not found', 404)) };

    const { current_password, new_password } = req.body;

    // Fetch the user by ID
    const user = await userModel.findById(_id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if the current password matches
    const isMatch = bcrypt.compareSync(current_password, user.password);
    if (!isMatch) {
        return next(new AppError('Enter a valid password', 400));
    }

    // Hash the new password
    if (new_password === current_password) {
        return next(new AppError('Try another password', 400));
    }
    const hash = bcrypt.hashSync(new_password, +process.env.HASH_PASS_NUM);

    // Update the user's password
    await userModel.findByIdAndUpdate(_id, { password: hash, passwordChangedAt: Date.now() });

    res.status(200).json({
        status: 'success',
        message: 'Account password updated successfully',
    });
});
// Forget password 

export const foregtPassword = catchAsyncError(async (req, res, next) => {

    const { identifier } = req.body;

    const user = await userModel.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] })
    const otp = generateOTP();;
    user.otp = otp;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    await sendEmailVerfication(user.email, { otp })


    res.status(200).json({ message: 'OTP sent successfully' })
})
// reset password

export const submitOtp = catchAsyncError(async (req, res) => {
    const { otp } = req.body
    const user = await userModel.findOne({ otp, resetPasswordExpires: { $gt: Date.now() } })
    if (!user) throw new AppError("otp is not valid or expires", 404)
    res.json({ message: "success" })
})


export const resetPassword = catchAsyncError(async (req, res) => {

    const { new_password, identifier } = req.body
    const user = await userModel.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] })
    const hashedPassword = bcrypt.hashSync(new_password, +process.env.hash_pass_num)
    user.password = hashedPassword;
    user.resetPasswordExpires = null
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
})

// Get all accounts associated to a specific recovery Email 


export const getAllAccountsAssociated = catchAsyncError(async (req, res) => {
    const { recoveryEmail } = req.body
    const Accounts = await userModel.find({ recoveryEmail }, { userName: 1 });
    res.status(200).json({ Accounts })
})



export const softDeleteUser = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    // Mark the user as deleted
    const user = await userModel.findByIdAndUpdate(_id, { isDeleted: true, isLoggedOut: true, status: 'offline' }, { new: true });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
        data: {
            user
        }
    });
});


export const userLoggedOut = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    // Mark the user as logged out
    const user = await userModel.findByIdAndUpdate(_id, { isLoggedOut: true, status: 'offline' }, { new: true });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'User logged out successfully',
        data: {
            user
        }
    });
});

