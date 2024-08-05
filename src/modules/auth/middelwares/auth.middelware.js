import jwt from "jsonwebtoken";
import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { userModel } from "../../user/models/user.model.js";
import { removeFile } from "../../../utilies/removeFile.js";



export const authorize = (...roles) => {
    return catchAsyncError(async (req, res, next) => {
        if (roles.includes(req.user.role)) return next()
        return next(new AppError('you not allowed to access this endpoint', 401))
    })
}

export const authenticate = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers
    if (!token) next(new AppError("Unathorized", 401))

    let userPayload = null;

    jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {

        if (error) return next(new AppError(error.message, 498))
        userPayload = payload
    })


    const user = await userModel.findById(userPayload._id)
    if (!user) return next(new AppError("user not found", 404))
    if (user.isLoggedOut)
        return next(new AppError("you must login first", 401))
    if (user.isDeleted) return next(new AppError("you must login first", 401))

    if (user.passwordChangedAt) {
        const time = parseInt(user?.passwordChangedAt.getTime() / 1000)
        if (time > userPayload.iat) return next(new AppError("Invalid token ... login again", 401))
    }
    req.user = user
    next()
})

export const checkUniqueIdentifier = catchAsyncError(async (req, res, next) => {
    const { email, mobileNumber } = req.body
    
    const user = await userModel.findOne({ $or: [{ email }, { mobileNumber }] })

    if (user) {
        await removeFile(req.file.path)
        throw new AppError('User Already exist !', 400)
    }
    next();
})

export const isUserExist = catchAsyncError(async (req, res, next) => {
    const { identifier } = req.body
    const user = await userModel.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] })
    !user ? next(new AppError("user is not found", 400)) : next()
})

export const isEmailExist = catchAsyncError(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    !user ? next(new AppError("email is not valid", 400)) : next()
})

export const checkAccountVerification = catchAsyncError(async (req, res, next) => {
    const { identifier } = req.body
    const user = await userModel.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] })
    if (!user) throw new AppError('User not found !', 400)
    else if (!user.email_verified) throw new AppError('you Must verified email !', 400)

    next();
})
