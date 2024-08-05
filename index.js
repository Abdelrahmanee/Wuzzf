import express from "express";

import dotenv from "dotenv";
import dbConnection from "./db/db.connection.js";
import bootstrap from './src/bootstrap.js'

dotenv.config()



const app = express()

const PORT = +process.env.PORT || 3000

bootstrap(app)





dbConnection()
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
