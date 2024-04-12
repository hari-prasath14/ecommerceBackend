import express from "express";
import {ProductCategory, ProductList, createProduct, deleteProduct, getProduct,getProductImage,getSingleProduct, getSingleProductById, productCount, productFilter, searchProduct, similarProduct, updateProduct } from "../Contollers/product.contoller.js";
import { isAdmin,verifyToken } from "../Middleware/authmiddleware.js";
import formidable from "express-formidable"

const router = express.Router()

router.post('/create-product',verifyToken,isAdmin,formidable(),createProduct)

router.get('/get-product',getProduct)
router.get('/get-product/:slug',getSingleProduct)
router.get('/get-productbyid/:id',getSingleProductById)
router.get('/product-image/:pid',getProductImage)
router.delete('/delete/:pid',verifyToken,isAdmin,deleteProduct)
router.put('/update/:id',verifyToken,isAdmin,formidable(),updateProduct)
router.post('/product-filter',productFilter)
router.get('/product-count',productCount)
router.get('/product-list/:page',ProductList)
router.get('/search/:keyword',searchProduct)
router.get('/similar-product/:pid/:cid',similarProduct)

//category wise products

router.get('/product-category/:slug',ProductCategory)


// payment route




// router.get('/allproducts',fetchAllProduct)
// router.get('/:id',fetchaProduct)
// router.put('/update/:id',verifyToken,isAdmin,updateProduct)
// router.delete('/delete/:id',verifyToken,isAdmin,deleteProduct)

export default router

