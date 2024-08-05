

import schedule from 'node-schedule'
import { userModel } from '../modules/user/models/user.model.js'




// const job =schedule.scheduleJob('* 15 * * * *' , function(){
//     console.log();
// })
export const cron = () => {

    schedule.scheduleJob('0 0 0 1 * *',async function () {
       const deletedAccounts = await userModel.deleteMany({email_verified : false})
       console.log(deletedAccounts);
    })
    schedule.scheduleJob('0 10 * * * *',async function () {
       const req = await userModel.find({_id : "66a6ffce63f29952fa5a8004"})
       console.log(req);
    })
}