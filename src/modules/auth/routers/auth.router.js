


import { Router } from "express";
import { confirm_email, signIn, signUp } from "../controllers/auth.controller.js";
import { checkAccountVerification, checkUniqueIdentifier } from "../middelwares/auth.middelware.js";
import { validate } from "../../../middelwares/validation.middelware.js";
import { signinSchema, signupSchema } from "../validations/auth.validation.js";
import { validateFields } from "../../../middelwares/validateFields.js";
import { uploadSingle } from "../../../middelwares/upload.middelware.js";

const router = Router()

router.post('/signUp',
    uploadSingle('profilePicture', 'profilePictures'),
    validate(signupSchema),
    checkUniqueIdentifier,
    signUp
)
router.post('/signIn', validate(signinSchema), checkAccountVerification, signIn)
router.get('/confirmEmail/:token', confirm_email)

export default router;