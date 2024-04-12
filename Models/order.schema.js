import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    products: [
        {
            type: mongoose.ObjectId,
            ref: "Product",
            quantity:{
                type:Number
            }
        }
    ],
    Amount:{
        type:Number,
    },
    buyer:{
        type: mongoose.ObjectId,
        ref: "User"        
    },
    paymentId:{
        type:String
    },
    paymentStatus:{
        type:String,
        default:"PAYMENT FAILED"
    },
    status:{
        type:String,
        default:'Not Process',
        enum:['Not Process','Processing','Shipped','Delivered','Cancel'],
    },
},{timestamps: true})

const Order = mongoose.model('Order',orderSchema)

export default Order