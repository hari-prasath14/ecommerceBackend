import mongoose from "mongoose";

export const validMongoDbId = (id,req,res) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id)
    console.log(isValid)
    if(isValid){
    console.log("happy");
    }
    else
    {
        //throw new Error("Not Valid")
        return res.status(400).json({message:"Not Valid"})
    }
}