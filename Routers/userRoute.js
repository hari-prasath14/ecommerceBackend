import express from 'express'
import { registerUser,loginUser,updateUser,forgotPasswordController, InsertCartItem, GetCartItem, GetOrders, GetAllOrders, updateStatus
} from '../Contollers/user.controller.js'
const router = express.Router()
import { verifyToken,isAdmin } from '../Middleware/authmiddleware.js'


//Resgistering new user
router.post('/register',registerUser)

//login user
router.post('/login',loginUser)

//verifying Token
router.get('/user-auth',verifyToken,(req,res)=>{
    res.status(200).send({verified:true})
})

//verifying Token and checking is Admin
router.get('/admin-auth',verifyToken,isAdmin,(req,res)=>{
    res.status(200).send({verified:true})
})

// Forgot Password
router.post('/forgot-password',forgotPasswordController)

//Update User
router.put('/update',verifyToken,updateUser)

//Insert Cart Items

router.put('/insert-cart',verifyToken,InsertCartItem)

//Get Cart Items

router.get('/get-cart',verifyToken,GetCartItem)

//Get Orders

router.get('/get-orders',verifyToken,GetOrders)

//Get All Orders

router.get('/get-allorders',verifyToken,isAdmin,GetAllOrders)

//Update Order Status

router.put('/update-orderstatus/:orderId',verifyToken,isAdmin,updateStatus)





// router.get('/getUsers',getAllUser)
// router.get('/refresh',handleRefreshToken)
// router.delete('/delete/:id',deleteUser)
// router.put('/block-user/:id',verifyToken,isAdmin,blockUser)
// router.put('/unblock-user/:id',verifyToken,isAdmin,unBlockUser)
// router.get('/:id',verifyToken,isAdmin,getUserById)



export default router