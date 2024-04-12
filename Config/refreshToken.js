import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateRefreshToken =(id)=>{
    // console.log(id);
    const refreshToken = jwt.sign({id},process.env.JWT_SECRETKEY)
    return refreshToken
}