import express from 'express'
import { isAdmin, verifyToken } from '../Middleware/authmiddleware.js'
import { createCategory, deleteCategory, getAllCategory, singleCategory, updateCategory } from '../Contollers/category.controller.js'

const router = express.Router()

router.post('/create-category',verifyToken,isAdmin,createCategory)
router.put('/update-category/:id',verifyToken,isAdmin,updateCategory)
router.get('/get-category',getAllCategory)
router.get('/get-category/:slug',singleCategory)
router.delete('/delete-category/:id',verifyToken,isAdmin,deleteCategory)


export default router