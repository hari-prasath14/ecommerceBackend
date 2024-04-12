import slugify from "slugify";
import Product from "../Models/product.schema.js";
import Category from "../Models/category.schema.js";
import Order from "../Models/order.schema.js";
import fs from 'fs'
import dotenv from 'dotenv';
import stripe from "stripe";


dotenv.config()


export const createProduct = async (req,res)=>{
    try{

        const {name,slug,description,price,category,quantity,shipping,brand} = req.fields
        const {images} =req.files
        console.log(category);
  

        // console.log(name,slug,description,price,category,quantity,shipping)
        switch (true) {
            case !name:
                return res.status(500).send({message:"Name is required"})
            case !description:
                return res.status(500).send({message:"description is required"})
            case !price:
                return res.status(500).send({message:"price is required"})
            case !category:
                return res.status(500).send({message:"category is required"})
            case !quantity:
                return res.status(500).send({message:"quantity is required"})
            case !brand:
                return res.status(500).send({message:"brand is required"})
            case images && images.size > 10000000 :        
                return res.status(500).send({message:"shipping is required and should be less than 1 MB"})         
        }

        if(images){
        var obj = {

            name:name,
        
            slug: slugify(name),
        
            description:description,
        
            price:price,
            
            category:category,
        
            quantity:quantity,

            shipping :shipping,
            
            brand: brand,

            images: {
                data: fs.readFileSync(images.path),
                contentType: images.type
            }
        }
        Product.create(obj)
        res.status(200).json({success:true,message:"Product created successfully",obj})
    }

        // if(images){

        
        //     console.log(fs.readFileSync(images.path))
        //     Product.images.data = fs.readFileSync(images.path)            
        //     Product.images.contentType = images.type    
        // }

        else{
        const newproduct = new Product({...req.fields, slug: slugify(name)}) 
        await newproduct.save() 
        res.status(200).json({success:true,message:"Product created successfully",newproduct})
        }
       

         //this is one method to create document in database

        // product.create(req.body) //this is another one method to create document in database
       
    }
    catch(err){
        console.log(err);
    res.status(500).send({success:false,message:"Error in creating product",err})
    }
}







export const getProduct = async(req,res)=>{
    try{
        const allProducts = await Product.find()
        .select('-images')
        .populate('category')
        .limit(10)
        .sort({createdAt:-1})
        res.status(200).send({success:true ,allProducts,productCount:allProducts.length})
    }
    catch(err){
        console.log(err);
        res.status(500).send({success: false ,message:"Error in getting all products"})
    }
}

export const getSingleProduct = async(req,res) =>{
    try{
        // console.log(req.params.slug);    
        const oneProduct = await Product.findOne({slug:req?.params?.slug})
        .select('-images')
        .populate('category')
        res.status(200).send({success:true,oneProduct})
    }
    catch(err){
        console.log(err);

        res.status(500).send({message:"Error in getting single product"})

    }
}

export const getSingleProductById = async(req,res) =>{
    try{
        const id = req.params
        const oneProduct = await Product.findOne({_id:req.params.id})
        .select('-images')
        .populate('category')
        res.status(200).send({success:true,oneProduct})
    }
    catch(err){
        console.log(err);

        res.status(500).send({message:"Error in getting single product"})

    }
}




export const getProductImage = async (req, res) => {
    try {
        const productId = req.params.pid;

        // Check if productId is "undefined" as string
        if (productId === "undefined") {
            return res.status(400).send({ success: false, message: "Product ID is missing" });
        }

        const productImage = await Product.findById(productId).select('images');

        if (!productImage) {
            return res.status(404).send({ success: false, message: "Product not found" });
        }

        if (productImage.images.data) {
            res.set('Content-type', productImage.images.contentType);
            return res.status(200).send(productImage.images.data);
        }
    } catch (error) {
        console.log("check image error", error);
        res.status(500).send({ success: false, message: "Error in getting product image" });
    }
}

export const deleteProduct = async(req,res) =>{
    
        try{
        const id = req.params.pid
        await Product.findByIdAndDelete({_id : id})
        res.status(200).send({success:true,message : "Product Deleted" })
    
        }
        catch(err){
            console.log(err);
            res.status(200).send({success:false,message : err})
        }
    
    }

export const updateProduct = async(req,res) =>{

   
        try{
            const {name,description,price,category,quantity,shipping,brand} = req.fields
            const {images} =req.files
            const {id} = req.params

            if(req.fields.name){
                req.body.slug = slugify(req.fields.name)
                
            }
            const updatedProduct = await Product.findByIdAndUpdate(id,req.fields,{new : true})
            res.status(200).send({success:true,updatedProduct})

        
            }
        catch(err){
            console.log(err);
            res.status(500).send({success:false,message : err})
            }

}


export const productFilter = async(req,res)=>{
  
    try{ 
        const {checked,radio} = req.body
        const args ={}

        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0],$lte: radio[1]}
        const filteredProduct = await Product.find(args)
        res.status(200).send({success:true,filteredProduct})


    }
    catch(err){
        console.log(err);
        res.status(400).send({success:false,message:"Error in filtering products",err})
    }
}

export const productCount =async(req,res)=>{
    try 
    {
        const total = await Product.find().estimatedDocumentCount()
        res.status(200).send({success:true,total})

    } 
    catch (error) {
        console.log(error);

        res.status(400).send({success:false,message:"Error in getting count of products",error})

    }
}

export const ProductList = async (req,res)=>{
    try{
        const perPage = 10
        const page = req.params.page || 1
        const products = await Product.find()
        .select('-images')
        .skip((page-1)*perPage)
        .limit(perPage)
        .sort({createdAt:-1}) 
        
        res.status(200).send({success:true,products})
    }
    catch(error)
    {
        console.log(error);

        res.status(400).send({success:false,message:"Error in per page",error})

    }
}

//Search Product

export const searchProduct = async (req,res)=>{
    try 
    {
        const {keyword} = req.params
        const result = await Product.find({
            $or:[
                {name:{$regex :keyword ,$options : "i"}},
                {description:{$regex :keyword ,$options : "i"}},
                {brand:{$regex :keyword ,$options : "i"}}
                
            ]
        }).select('-images')
        res.json(result)
    } 
    catch (error) 
    {
        console.log(error);   
        res.status(400).send({success:false,message:"Error in search",error})
    }
}

export const similarProduct = async(req,res)=>{
   try 
   {
        const {pid,cid} = req.params
        const similarProducts = await Product.find({
            category:cid,
            _id:{$ne: pid}
        }).select('-images').limit(5).populate('category')
    
        res.status(200).send({success:true,similarProducts})
       
   }
    catch (error) 
   {
    console.log(error);

    res.status(400).send({success:false,message:"Error in getting similar products",error})

   }
}

export const ProductCategory =async (req,res) =>{
    try
    {
        const category = await Category.find({slug:req.params.slug})
        const categoryProducts = await Product.find({category}).populate('category')
        res.status(200).send({success:true,category,categoryProducts})

    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({success:false,message:'Error in getting category wise Products'})
    }
}

// payment gateway api




// export const fetchAllProduct = async (req,res)=>{
//     try{
//         //FILTERING
//         const query = {...req.query}
//         const exclude = ["sort","field","page"]
//         exclude.forEach((e)=> {
//             delete query[e]
//         })
//         const queryStr = JSON.stringify(query)
//         const newQuery = queryStr.replace(/gte|gt|lte|lt/g,(match)=> `$${match}`)
        
//         let Products ={}

//         //PAGINATION 

//         let page = req.query.page || 0
//         let limit = 5
//         let skip = page*limit

//         // SORTING & SELECTING FIELDS

//         if(req.query.sort||page){
//             let selectedField
//             if(req.query.field){
//              selectedField = JSON.stringify(req.query.field).split(",").join(" ")
//              selectedField = JSON.parse(selectedField)
//             }
            
            
//             Products = await product.find(JSON.parse(newQuery)).skip(skip).limit(limit).select(selectedField).sort(req.query.sort)
//             if(Products.length === 0)
//             {
//                 return res.status(200).json({message:"page does not exist"})
//             }
//         }
//         else{
//             Products = await product.find(JSON.parse(newQuery)).select("-__v")    
           
//         }
        
//         res.status(200).json({Products})
        
//     }
//     catch(err){
//         console.log(err);
//     res.status(200).json({message:err})
//     }
// }

// export const fetchaProduct = async (req,res)=>{
//     try{
//         const {id} = req.params
//         const findProduct = await product.findById(id)   
//         res.status(200).json({findProduct})
//     }
//     catch(err){
//     res.status(200).json({message:err})
//     }
// }

// export const updateProduct = async(req,res) =>{
    
//     try{
//     const {id} = req.params
//     console.log("up",req.body);
//     const updatedProduct = await product.findByIdAndUpdate(id,req.body,{new : true})
//     console.log("up",updatedProduct);
//     res.status(200).json({updatedProduct})

//     }
//     catch(err){
//         res.status(200).json({message : err})
//     }

// }

// export const deleteProduct = async(req,res) =>{
    
//     try{
//     const {id} = req.params
//     await product.deleteOne({_id : id})
//     res.status(200).json({message : "Product Deleted" })

//     }
//     catch(err){
//         console.log(err);
//         res.status(200).json({message : err})
//     }

// }