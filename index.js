import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Config/dbConnect.js';
import userRouter from './Routers/userRoute.js';
import productRouter from './Routers/productRoute.js';
import categoryRouter from './Routers/category.Route.js'
import orderRouter from './Routers/order.Route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app= express()
dotenv.config()


//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

//Ruters
app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/product',productRouter)
app.use('/api/order',orderRouter)

const port = process.env.Port

//connecting Database
connectDB()

app.listen(port,()=>{
console.log("app listening port",port);
})