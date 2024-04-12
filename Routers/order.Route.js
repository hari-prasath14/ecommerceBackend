import { MakePayment, checkPaymentStatus, updatePaymentStatus } from "../Contollers/order.controller.js";
import express from 'express'
import { verifyToken } from "../Middleware/authmiddleware.js";

const router = express.Router()

router.post('/make-payment',verifyToken,MakePayment)
router.get('/payment-status',verifyToken,checkPaymentStatus)
router.put('/update-payment-status',updatePaymentStatus)


export default router
