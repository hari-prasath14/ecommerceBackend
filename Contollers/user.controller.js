import User from "../Models/user.schema.js";
import Order from "../Models/order.schema.js";
import bcrypt from 'bcrypt';
import { create_token } from "../Middleware/authmiddleware.js";
import { validMongoDbId } from "../Utils/validMongoDbID.js";
import {generateRefreshToken} from "../Config/refreshToken.js";
import { hashPassword,comparePassword} from "../helpers/auth.Helper.js";
import cookie from "cookie-parser";


export const registerUser = async (req, res) => {
    try {
        const {firstName,lastName,emailID,mobileNumber,password,address,answer} = req.body

        if(!firstName){
            return res.status(200).send({message:" Name is Required"})
        }
        if(!lastName){
            return res.status(200).send({message:" lastName is Required"})
        }
        if(!emailID){
            return res.status(200).send({message:" emailID is Required"})
        }
        if(!mobileNumber){
            return res.status(200).send({message:" mobileNumber is Required"})
        }
        if(!password){
            return res.status(200).send({message:" password is Required"})
        }
        if(!address){
            return res.status(200).send({message:" address is Required"})
        }
        if(!answer){
            return res.status(200).send({message:" Enter any Favorites for future verification"})
        }
        

        
        const findUser = await User.findOne({ emailID: emailID })
        if (!findUser) {
            //Create User

            //bcrypting password
           
            const hashedPassword = await hashPassword(password)

            const newUser = new User({
                firstName,
                lastName,
                emailID,
                mobileNumber,
                password : hashedPassword,
                address,
                answer
            })
            await newUser.save()
            return res.status(201).send({message:"Resgistered Successfully",success:true})

        }
        else {
            //email alredy exist
            return res.status(200).send({ message: "Email already exist" ,success:false})
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }

}

export const loginUser = async (req, res) => {
    try {
        if(!req.body.emailID || !req.body.password)
            {
                return res.status(200).json({message:"Enter Details",success: false})
            }

        const email = req.body.emailID
        const findUser = await User.findOne({ emailID: email })

        if (findUser) {
            //registered user;        
            //comparing bcrypting password
            const matchedPassword = await comparePassword(req.body.password, findUser.password)

            if (matchedPassword) {

                // const refreshToken  = await generateRefreshToken(findUser._id.toString())
                // res.cookie("RefreshToken",refreshToken,{
                // httpOnly : true,
                // maxAge : 24 * 60 * 60 * 1000,
                // })

                // const updateUser = await User.findByIdAndUpdate(findUser._id,
                // // {refreshToken:refreshToken},
                // {new : true})



                //sending id to create token by converting into string
                
                const token = create_token(findUser._id.toString())

                
               
                res.status(200).json({ message: "Login Successfully",success: true ,findUser,token})
            }
            else {

                res.status(200).json({ message: "Please check your password",success: false })

            }

        }
        else {
            //email alredy exist
            return res.status(200).json({ message: "User Not Found",success: false })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }

}


//forgot password

export const forgotPasswordController = async(req,res) =>{

    try{
        const {emailID,answer,newPassword} = req.body

        


        if(!emailID)
        {
        return res.status(200).send({message:"Email is required",success:false})
        }
        if(!answer)
        {
        return res.status(200).send({message:"Enter your favorite",success:false})
        }
        if(!newPassword)
        {
        return res.status(200).send({message:"newPassword is required",success:false})
        }



        const user = await User.findOne({emailID,answer})

        if(!user){
           return res.status(200).send({message:"Enter valid details",success:false})
        }
        const hashedPassword = await hashPassword(newPassword)

        await User.findByIdAndUpdate(user._id,{password:hashedPassword})
        res.status(200).send({message:"Password reset successfully",success:true})


    }

    catch(err){
        res.status(500).send({message:"Something went wrong",success:false,err})
    }
    
}

export const updateUser = async (req, res) => {
    try {
        const {firstName,lastname,emailID,password,address,mobileNumber} = req.body
        
        const user = await User.findById(req.user._id)

        //Password

        if(password && password.length < 8){
            return res.json({error:"Password is required and 8 character long"})
        }

        const hashedPassword = password ? await hashPassword(password) : undefined

        const updatedUser = await User.findByIdAndUpdate(req.user._id,{

            firstName: firstName || user.firstName,
            lastName:lastname || user.lastname,
            emailID:emailID || user.emailID,
            mobileNumber:mobileNumber || user.mobileNumber,
            password : hashedPassword || user.password
        

        },{new:true})          
        

        res.status(200).send({success:true,message: "Profile updated successfully",updatedUser})

    }
    catch (err) {
        console.log(err);
        res.status(500).send({success:false,message:"Error while updating User", err })
    }
}

export const InsertCartItem = async(req,res)=>{
    try 
    {
      const {cart}   = req.body

      const finalResult = await User.findByIdAndUpdate(req.user._id,{
        cart:cart
      },{new:true})



      res.status(200).send({success:true,finalResult})
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success:false,error})
    }
}

export const GetCartItem = async(req,res)=>{
    try 
    {
      let cartArray 
      const result = await User.find(req.user._id).select('cart')
      result.map((item)=>{
      cartArray = item.cart

      })

      res.status(200).send({success:true,cartArray})
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success:false,error})
    }
}

export const GetOrders = async(req,res) =>{
    try 
    {
        const userOrder = await Order.find({buyer:req.user._id}).populate('products','-images').populate('buyer','firstName')
        res.status(200).send({success:true,userOrder})
    } 
    catch (error) 
    {
        console.log(error);    
        res.status(500).send({success:false,error})

    }
}

export const GetAllOrders = async(req,res) =>{
    try 
    {
        const allOrders = await Order
        .find({})
        .populate('products','-images')
        .populate('buyer','firstName')
        res.status(200).send({success:true,allOrders})
    } 
    catch (error) 
    {
        console.log(error);    
        res.status(500).send({success:false,error})

    }
}
export const updateStatus = async(req,res) =>{
    try 
    {
        const {orderId} =req.params
        const {status} =req.body

        const orders = await Order.findByIdAndUpdate(orderId,{status},{new:true})

        res.status(200).send({success:true,orders})
    } 
    catch (error) 
    {
        console.log(error);    
        res.status(500).send({success:false,error})

    }
}

























// export const handleRefreshToken = async (req,res) => {

//     try{
//     const a = req.cookies;
//     console.log(a);
//     }
//     catch(err){
//         console.log(err);
//     }

// }

// export const getAllUser = async (req, res) => {
//     try {
//         const allUser = await User.find()
//         res.status(200).json({ allUser })

//     }
//     catch (err) {
//         res.status(500).json({ err })
//     }
// }

// export const getUserById = async (req, res) => {
//     try {
//         const userID = req.params.id
//         // console.log(req.hari)
//         validMongoDbId(userID)

//         const getAUser = await User.findById(userID)

//         res.status(200).json({ getAUser })

//     }
//     catch (err) {
//         res.status(200).json(err)
//     }
// }

// export const deleteUser = async (req, res) => {
//     try {
//         const userID = req.params.id
//         validMongoDbId(userID)


//         const result = await User.deleteOne({ _id: userID })

//         if (result.deletedCount === 0) {
//             return res.status(200).json({ message: "User not found" })
//         }

//         res.status(200).json({ message: "Deleted successfully" })

//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ err })
//     }
// }

// export const updateUser = async (req, res) => {
//     try {
//         const userID = req.user._id
        
//         validMongoDbId(userID)

//         const updatedUser = await User.findByIdAndUpdate(userID,{
//             firstName:req.body.firstName,
//             lastName:req.body.lastName,
//             emailID:req.body.emailID,
//             mobileNumber:req.body.mobileNumber,
//             role:req.body.role,
            
//         },{new:true})

//         res.status(200).json({updatedUser})

//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ err })
//     }
// }

// export const blockUser =async (req,res)=>{
//     const toBeBlockedID = req.params.id;
//     const toBeBlockedUserDetail =  await User.findByIdAndUpdate(toBeBlockedID,
//         {isBlocked : true},
//         {new:true})
//     res.status(200).json({message:"user blocked",toBeBlockedUserDetail})

// }

// export const unBlockUser =async (req,res)=>{
//     const toBeUnBlockedID = req.params.id;
//     const toBeUnBlockedUserDetail =  await User.findByIdAndUpdate(toBeUnBlockedID,
//         {isBlocked : false},
//         {new:true})
//     res.status(200).json({message:"user UnBlocked",toBeUnBlockedUserDetail})

// }