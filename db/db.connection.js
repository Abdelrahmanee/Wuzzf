import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


const dbConnection = () => {
    mongoose.connect(process.env.DBconnection)
        .then(() => console.log("DB connected successfully..."))
        .catch(() => console.log("Error db connection"))
}

export default dbConnection;