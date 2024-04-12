import User from "../Models/user.schema.js";

import Product from "../Models/product.schema.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
import Order from "../Models/order.schema.js";

dotenv.config()


export const MakePayment = async(req,res) => {

    try 
    {
        const {auth,cartItems}= req.body
        
    


       if(cartItems.length !== 0)
       { 
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url:`${process.env.CLIENT_URL}/payment-success`,
            cancel_url:`${process.env.CLIENT_URL}/payment-failure`,
            customer_email:auth.user.emailID,
        

            line_items:cartItems.map((item)=>{
                
                return{

                    price_data:{
                        currency:'USD',
                        unit_amount:item.price,

                        product_data:{
                            name:item.name,
                            description:item.description,
                        }
                    

                    },
                    quantity:cartItems.length
                }

            })        
       
            })
            const newOrder = new Order({
                products:cartItems,
                Amount : session.amount_total/ 100,
                buyer:auth.user,
                paymentId:session.id
                
            })
            await newOrder.save()
            res.status(200).json({success:true,session,url:session.url})
        }
        
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success:false,message:"Error while making error",error})
    }

}


export  const checkPaymentStatus = async(req,res) =>{
    try {

        const userID = req.user._id
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        const order = await Order.find({buyer:userID})
        let paymentId

        order.map((item)=>{
            
            paymentId = item.paymentId

        })
        const session = await stripe.checkout.sessions.retrieve(paymentId);
        
        if (session.payment_status === 'paid') {

            const payment_status = session.payment_status
            await User.findByIdAndUpdate(req.user._id,{
                cart:[]
              },{new:true})
            res.status(200).send({payment_status,paymentId})
            // Mark the payment as done in your system
        } else {
            await Order.deleteOne({paymentId:paymentId})
            // Handle the case where payment is not yet completed
        }
    } 
    catch (error) {
        // console.error('Error retrieving payment session:', error);
        // Handle error
    }
}


export const updatePaymentStatus = async(req,res) =>{

    try{
        const {paymentId,payment_status} = req.body
        const result = await Order.findOneAndUpdate({paymentId:paymentId},{paymentStatus:payment_status},{new:true})
        res.status(200).send({success:true,message:"error in updating order"})

    }
    catch(error){
        console.log(error);
        res.status(500).send({success:false,message:"error in updating order"})
    }
}
