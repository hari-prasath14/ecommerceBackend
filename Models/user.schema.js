import mongoose from "mongoose";
const userSchema= mongoose.Schema({
firstName :{
    type:String,
    required:true,
    trim:true,
},
lastName :{
    type:String,
    required:true,
    trim:true,
},
emailID :{
    type:String,
    required:true,
    trim:true,
},
password :{
    type:String,
    required:true,
    trim:true,
},
mobileNumber :{
    type:String,
    required:true,
},
role:{
    type:String,
    default:'user'
},
answer:{
    type:String,
    required: true
},
address:{
    type : String,
    required:true
},
cart:
[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'CartItems',
    }
]


},{timestamps:true})

const User = mongoose.model('User',userSchema)
export default User;