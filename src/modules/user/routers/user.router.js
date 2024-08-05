import { authenticate, authorize, checkAccountVerification, checkUniqueIdentifier, isEmailExist, isUserExist } from "../../auth/middelwares/auth.middelware.js";
import { anotherUserInfo, deleteAccount, foregtPassword, getAllAccountsAssociated, resetPassword, submitOtp, updateAccount, updateAccountEmail, updatePassword, userInfo } from "../controllers/user.controller.js";

import { Router } from "express";
import { anotherUserInfoSchema, foregtPasswordSchema, recoveryEmailSchema, resetPasswordSchema, submitOtpSchema, updateAccountEmailSchema, updateAccountSchema, updatePasswordSchema } from "../validations/user.validation.js";
import { validate } from "../../../middelwares/validation.middelware.js";
import { ROLES } from "../../../utilies/enums.js";
import { uploadSingle } from "../../../middelwares/upload.middelware.js";
import { validateFields } from "../../../middelwares/validateFields.js";


const router = Router()

// user cruds
router.put('/updateAccount',
    validateFields(updateAccountSchema),
    authenticate,
    uploadSingle('profilePicture', 'profilePictures'),
    updateAccount
)
router.patch('/update-email',
    validate(updateAccountEmailSchema),
    authenticate,
    authorize(ROLES.USER, ROLES.MANGER),
    updateAccountEmail
)
router.delete('/deleteAccount', authenticate, authorize(ROLES.USER, ROLES.ADMIN), deleteAccount)

router.patch('/updatePassword',
    validate(updatePasswordSchema), authenticate, updatePassword)

router.get('/userInfo', authenticate, userInfo)



// forget password apis
router.post('/forget-password', validate(foregtPasswordSchema), checkAccountVerification, foregtPassword)
router.post('/verify-otp', validate(submitOtpSchema), submitOtp)

router.post('/reset-password', validate(resetPasswordSchema), isUserExist, resetPassword)


router.get('/getSpecificRecoveryEmail',
    validate(recoveryEmailSchema), authenticate, authorize(ROLES.USER, ROLES.ADMIN), getAllAccountsAssociated)

router.get('/:id',
    validate(anotherUserInfoSchema), authenticate, anotherUserInfo)


export default router

