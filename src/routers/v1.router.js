

import { Router } from 'express'
import authRouter from '../modules/auth/routers/auth.router.js'
import userRouter from '../modules/user/routers/user.router.js'
import companyRouter from '../modules/company/routers/company.router.js'
import jopRouter from '../modules/jop/routers/jop.router.js'
import applictiantRouter from '../modules/app/routers/app.router.js'

const router = Router()

router.use('/auth' ,authRouter)
router.use('/users', userRouter)
router.use('/companies', companyRouter)
router.use('/jops', jopRouter )
router.use('/applications', applictiantRouter )

export default router
