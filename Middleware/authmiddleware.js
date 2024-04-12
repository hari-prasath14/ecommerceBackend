import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import User from "../Models/user.schema.js";

// CREATING JWT
export const create_token =(id)=>{
    // console.log(id);
    const token = jwt.sign({id},process.env.JWT_SECRETKEY,{expiresIn : "7d"})
    return token
}

//VERIFYING JWT

export const verifyToken =async (req,res,next)=>{

    
const token = req.header('Authorization')


if(token){
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY)
        const getUser = await User.findById(decoded.id)
        if (getUser) {
            req.user=getUser            
            next()            
        }
        else{
        res.status(200).send({success:false,message:"Please login again"})
        }
       
        
    }
    catch(err){
        return res.status(200).send({message:"Invalid Token","err":err})
    }
}
else{
    return res.status(200).send({message:"no token ,Please Login Again"})
}
}

export const isAdmin=async (req,res,next)=>{
    const {emailID} = req.user
    const adminUser = await User.findOne({emailID:emailID})
    if(adminUser.role === "admin")
    {
        next()
    }
    else{
        return res.status(200).json({message:"YOU ARE NOT ADMIN"})
    }
    

}