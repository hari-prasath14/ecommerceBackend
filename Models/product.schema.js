import mongoose from "mongoose";
const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    slug:{
        type: String,
        lowercase:true,
    },

    description:{
        type:String,
        required:true,
    },

    price:{
        type:Number,
        required:true,
    },
    
    category:{      
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,

        // type:String,
        // required:true,
    },

    brand:{
        type:String,
        required:true
    },

    quantity:{
        type:Number,
        req:true,
    },

    images:{
        data: Buffer,
        contentType: String
    },

    shipping:{
        type:Boolean,        
    }

},
{ timestamps:true }
)
const Product = mongoose.model('Product',productSchema)
export default Product