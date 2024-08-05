import Joi from "joi";



export const updateAccountSchema = Joi.object({
    body: {
        recoveryEmail: Joi.string().email(),
        password: Joi.string().pattern(new RegExp('^[1-9]')),
        firstName: Joi.string().min(2).max(100),
        lastName: Joi.string().min(2).max(100),
        DOB: Joi.date(),
        mobileNumber: Joi.string(),
    },
    params: {},
    query: {},
    file: {
        profilePicture: Joi.string().optional()
    }
})
export const updateAccountEmailSchema = Joi.object({
    body: {
        email: Joi.string().email().required(),
    },
    params: {},
    query: {},
    file: {
        profilePicture: Joi.string().optional()
    }
})

export const anotherUserInfoSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex().length(24).required(), },
    query: {}
})

export const updatePasswordSchema = Joi.object({
    body: {
        new_password: Joi.string().pattern(new RegExp('^[1-9]')).required(),
        current_password: Joi.string().pattern(new RegExp('^[1-9]')).required(),
    },
    params: {},
    query: {}
})
export const submitOtpSchema = Joi.object({
    body: {
        otp: Joi.string()
            .pattern(/^\d{6}$/)
            .required()
            .messages({
                'string.pattern.base': 'OTP must be exactly 6 digits.',
                'any.required': 'OTP is required.'
            }),
    },
    params: {},
    query: {}
})
export const foregtPasswordSchema = Joi.object({
    body: {
        identifier: Joi.string().required(),
    },
    params: {},
    query: {}
})

export const resetPasswordSchema = Joi.object({
    body: {
        new_password: Joi.string().pattern(new RegExp('^[1-9]')).required(),
        identifier: Joi.string().required(),
    },
    params: {},
    query: {}
})
export const recoveryEmailSchema = Joi.object({
    body: {
        recoveryEmail: Joi.string().email()
    },
    params: {},
    query: {}
})



