import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { companyModel } from "../../company/models/company.model.js";
import { jopModel } from "../../jop/models/jop.model.js";
import { userModel } from "../../user/models/user.model.js";




export const allowedToCompanyHrOnly = catchAsyncError(async (req, res, next) => {

    const { _id: userId } = req.user
    if (!userId) throw new AppError("user not found", 404)
    const company = await companyModel.findOne({ companyHR: userId })
    if (!company) throw new AppError("company hr only have access", 409)
    req.company = company;
    next()

})



export const checkJopOwner = catchAsyncError(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { id: jopId } = req.params;
    const user = await userModel.findById(userId)
    const jop = await jopModel.findById(jopId)
    if (!user || !jop) return next(new AppError('jop not found', 404));
    const owner = await jopModel.findOne({ _id: jopId, addedBy: userId });
    if (!owner) {
        return next(new AppError('Owner only can control company', 403));
    }
    next();
});