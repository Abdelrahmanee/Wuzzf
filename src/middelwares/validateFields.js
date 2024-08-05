import { AppError } from "../utilies/error.handel.js";








export const validateFields = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new AppError(errorMessage, 400));
    }
    next();
};