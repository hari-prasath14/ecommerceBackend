import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const connectDB =async()=>{
    try{
        const mongoURL = process.env.MONGODBCONNECTIONSTRING
        const connection = await mongoose.connect(mongoURL)
        console.log("db connected successfully");
        return connection

    }
    catch(err){
        console.log(err);

    }

}

export default connectDB
